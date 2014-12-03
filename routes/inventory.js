var express = require('express');
var router = express.Router();
var path = require('path');

var getContext = function (request) {
	return request.app.get('appContext');
};

var getTextLookups = function (request) {
	return getContext(request).textLookups;
};

var getForecastingService = function (request) {
	return getContext(request).forecastingService;
};

var getRecommenderService = function (request) {
  return getContext(request).recommenderService;
};

var getModelSelections = function (models, curModel, textLookup) {
	var options = [];

	for (var key in models) {
		options.push({
			value: key,
			name: textLookup.models[key].name,
			selected: (key === curModel)
		});
	}

	return options;
};

var getWeekSelections = function (totalWeeks, curWeek, defWeek) {
	if (!curWeek) {
		curWeek = (defWeek) ? defWeek : 20;
	}

	var options = [];

	for (var i = 1; i <= totalWeeks; i++) {
		options.push({
			value: i,
			name: i,
			selected: (i == curWeek)
		});
	}

	return options;
};

router.get('/', function(req, res, next) {
  var forecastingService = getForecastingService(req);
  var textLookups = getTextLookups(req);
  var modelSelections = getModelSelections(forecastingService.models, null,
  	textLookups);
  var weeksBack = getWeekSelections(20, 20);
  var weeksForward = getWeekSelections(20, 1);

  forecastingService.getProducts(function (err, products) {
  	if (err) {
  		next(err);
  		return;
  	}

    res.render('inventory/index', { 
      title: 'Current Inventory',
      products: products,
      models: modelSelections,
      weeksBack: weeksBack,
      weeksForward: weeksForward,
      text: getTextLookups(req)
    });
  });
});

router.get('/nextWeek', function (req, res, next) {
	var forecastingService = getForecastingService(req);
	var textLookups = getTextLookups(req);
	var modelName = req.query['model'];
	var selectedWeeksBack = req.query['weeksBack'];
  var selectedWeeksForward = req.query['weeksForward'];
	var model = forecastingService.getModel(modelName);
	var modelSelections = getModelSelections(forecastingService.models, modelName,
		textLookups);
	var totalWeeks = 20;
	var weeksBack = getWeekSelections(totalWeeks, selectedWeeksBack, 20);
  var weeksForward = getWeekSelections(totalWeeks, selectedWeeksForward, 1);
	var forecastingOptions = {
		weeksBack: (selectedWeeksBack && selectedWeeksBack > 0 && selectedWeeksBack < totalWeeks)
			? selectedWeeksBack : totalWeeks,
    weeksForward: (selectedWeeksForward && selectedWeeksForward > 0 && selectedWeeksForward <= totalWeeks)
      ? selectedWeeksForward : 1
	};

	if (!model) {
		next(new Error('Invalid model name: "' + modelName + '"'));
		return;
	}

	forecastingService.forecastOrders(model, forecastingOptions, function (err, products) {
		if (err) {
			next(err);
			return;
		}

    var recommenderService = getRecommenderService(req);

    recommenderService.makeRecommendation(
      recommenderService.getRecommender('simple'), products, forecastingOptions,
      function (err, products) {
        if (err) {
          next(err);
          return;
        }

    		res.render('inventory/index', {
    			title: 'Forecasted Sales',
    			products: products,
    			models: modelSelections,
    			weeksBack: weeksBack,
          weeksForward: weeksForward,
    			text: textLookups
    		});
      }
    );
	});
});

router.get('/source', function (req, res, next) {
  var xmlService = getContext(req).dataService;
  var xml = xmlService ? xmlService.getXML() : null;

  if (!xml) {
    next(new Error('XML file not found'));
    return;
  }

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

module.exports = router;
