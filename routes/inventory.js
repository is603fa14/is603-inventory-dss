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

var getWeekSelections = function (totalWeeks, curWeek) {
	if (!curWeek) {
		curWeek = 20;
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
  var weekSelections = getWeekSelections(20);

  forecastingService.getProducts(function (err, products) {
  	if (err) {
  		next(err);
  		return;
  	}

    res.render('inventory/index', { 
      title: 'Current Inventory',
      products: products,
      models: modelSelections,
      weeks: weekSelections,
      text: getTextLookups(req)
    });
  });
});

router.get('/nextWeek', function (req, res, next) {
	var forecastingService = getForecastingService(req);
	var textLookups = getTextLookups(req);
	var modelName = req.query['model'];
	var numWeeks = req.query['weeks'];
	var model = forecastingService.getModel(modelName);
	var modelSelections = getModelSelections(forecastingService.models, modelName,
		textLookups);
	var totalWeeks = 20;
	var weekSelections = getWeekSelections(totalWeeks, numWeeks);
	var forecastingOptions = {
		weeksBack: (numWeeks && numWeeks > 0 && numWeeks < totalWeeks)
			? numWeeks : totalWeeks
	}

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
    			title: 'Forecasted Sales for Next Week',
    			products: products,
    			models: modelSelections,
    			weeks: weekSelections,
    			text: textLookups
    		});
      }
    );
	});
});

module.exports = router;
