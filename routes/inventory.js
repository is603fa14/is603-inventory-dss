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

router.get('/', function(req, res, next) {
  var forecastingService = getForecastingService(req);
  var textLookups = getTextLookups(req);
  var modelSelections = getModelSelections(forecastingService.models, null,
  	textLookups);

  forecastingService.getProducts(function (err, products) {
  	if (err) {
  		next(err);
  		return;
  	}

    res.render('inventory/index', { 
      title: 'Current Inventory',
      products: products,
      models: modelSelections,
      text: getTextLookups(req)
    });
  });
});

router.get('/:index/nextWeek', function (req, res, next) {
	var forecastingService = getForecastingService(req);
	var prodIndex = req.params['index'];
	var modelName = req.query['model'];
	var model = forecastingService.getModel(modelName);

	if (!model) {
		next(new Error('Invalid model name: "' + modelName + '"'));
		return;
	}

	forecastingService.getProducts(function (err, products) {
		if (err) {
			next(err);
			return;
		}

		var product = products[prodIndex];
		var forecast = model.forecastDemand(product);
		res.send({forecast: forecast});
	});
});

router.get('/nextWeek', function (req, res, next) {
	var forecastingService = getForecastingService(req);
	var textLookups = getTextLookups(req);
	var modelName = req.query['model'];
	var model = forecastingService.getModel(modelName);
	var modelSelections = getModelSelections(forecastingService.models, modelName,
		textLookups);

	if (!model) {
		next(new Error('Invalid model name: "' + modelName + '"'));
		return;
	}

	forecastingService.forecastOrders(model, null, function (err, products) {
		if (err) {
			next(err);
			return;
		}

		res.render('inventory/index', {
			title: 'Forecasted Sales for Next Week',
			products: products,
			models: modelSelections,
			text: textLookups
		});
	});
});

module.exports = router;
