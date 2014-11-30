var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
// import the Forecasting Service to do the predictions
var ForecastingService = require('../services/ForecastingService');
// import the XML service to act as the database
var XmlService = require('../services/XmlService');
// import forecasting model
var SimpleForecastingModel = require('../services/models/SimpleForecastingModel');

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

        var productData = {};
        var productGraphs = [];
        var numWeeks = 4;
        var i = 0;
        var productNum = 0;
        var max = -1;
        for (var key in products) {
          var product = products[key];
          var productKey = "product" + key;
          while (i <= numWeeks && i < product.weeklySales.length) {
            var idx = i;
            var week = product.weeklySales[idx];
            var data;
            if (!productData.hasOwnProperty(week.id)) {
              var weekDescription;

              if (i === 1) {
                weekDescription = "Current";
              } else if (i === 0) {
                weekDescription = "+1";
              } else {
                weekDescription = "-" + (i - 1);
              }

              productData[week.id] = [];
              data = {
                "week": weekDescription
              };
            } else {
              data = productData[week.id];
            }
            data[productKey] = week.quantity.toString();
            productData[week.id] = data;
            i += 1;

            if (parseInt(week.quantity.toString()) > max) {
              max = parseInt(week.quantity.toString());
            }
          }
          productGraphs.push({
            "balloonText": "Quantity sold of [[title]]: [[value]]",
            "bullet": "round",
            "title": product.name,
            "valueField": productKey,
            "fillAlphas": 0,
            "hidden": productNum++ >= 5
          });
          i = 0;
        }

        res.render('index', {
          title: 'Inventory Dashboard',
          products: products,
          models: modelSelections,
          weeksBack: weeksBack,
          weeksForward: weeksForward,
          text: textLookups,
          productData: JSON.stringify(_.values(productData)).replace(/"/g, '\\"'),
          productGraphs: JSON.stringify(productGraphs).replace(/"/g, '\\"'),
          maxProduct: (max + (max % 10))
        });
      }
    );
  });
    
});

router.get('/sample', function (req, res) {
  // specify the XML file to use
  var xmlPath = path.join(__dirname, '../data/inventoryData.xml');
  var dataService = new XmlService(xmlPath);
  // create a forecasting service, pass in the XML file
  //var forecastingService = new ForecastingService(dataService);
  // create a model 
  //var model = new SimpleForecastingModel();

  //res.send(forecastingService.forecastOrders(model));
  dataService.getProducts(function(result) {
    res.send(result);
  });           
});

module.exports = router;
