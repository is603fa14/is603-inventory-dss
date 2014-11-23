var express = require('express');
var router = express.Router();
var path = require('path');

var getForecastingService = function (request) {
	return request.app.get('appContext').forecastingService;
};

var getModelSelections = function (models, curModel) {
	var options = [];

	for (var key in models) {
		options.push({
			value: key,
			name: key,
			selected: (key === curModel)
		});
	}

	return options;
};

router.get('/', function(req, res) {
  var forecastingService = getForecastingService(req);
  var modelSelections = getModelSelections(forecastingService.models);

  forecastingService.getProducts(function (products) {
    res.render('inventory/index', { 
      title: 'Current Inventory',
      products: products,
      models: modelSelections
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

	forecastingService.getProducts(function (products) {
		var product = products[prodIndex];
		var forecast = model.forecastDemand(product);
		res.send({forecast: forecast});
	});
});

router.get('/nextWeek', function (req, res, next) {
	var forecastingService = getForecastingService(req);
	var modelName = req.query['model'];
	var model = forecastingService.getModel(modelName);
	var modelSelections = getModelSelections(forecastingService.models, modelName);

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
			models: modelSelections
		});
	});
});

module.exports = router;
