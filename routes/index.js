var express = require('express');
var router = express.Router();
var path = require('path');
// import the Forecasting Service to do the predictions
var ForecastingService = require('../services/ForecastingService');
// import the XML service to act as the database
var XmlService = require('../services/XmlService');
// import forecasting model
var SimpleForecastingModel = require('../services/models/SimpleForecastingModel');

/* GET home page. */
router.get('/', function(req, res) {
  var name = req.query['name'];
  if (!name) {
    name = 'World';
  }
  res.render('index', { 
    title: 'Welcome!',
    name: name
  });
});

router.get('/sample', function (req, res, next) {
  // specify the XML file to use
  var xmlPath = path.join(__dirname, '../data/inventoryData.xml');
  console.log(xmlPath);
  var dataService = new XmlService(xmlPath);
  // create a forecasting service, pass in the XML file
  //var forecastingService = new ForecastingService(dataService);
  // create a model 
  //var model = new SimpleForecastingModel();

  //res.send(forecastingService.forecastOrders(model));
  dataService.getProducts(function(err, result) {
    if (err) {
      next(err);
      return;
    }

    res.send(result);
  });           
});

module.exports = router;
