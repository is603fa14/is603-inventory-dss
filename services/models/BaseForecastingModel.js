var assert = require('assert');
var Product = require('../../models/Product');
var WeeklySale = require('../../models/WeeklySale');

// base class for all forecasting models
// (this would be an abstract class in Java)
// define any functionality that should be common to all models here
var BaseForecastingModel = function () {

  this.forecastDemand = function (forProduct) {
  	assert(forProduct instanceof Product, 'Unknown product model');
   
    return new WeeklySale({
      quantity: this.getForecastedQuantity(forProduct),
      forecasted: true
    });    
  };

  this.getForecastedQuantity = function (forProduct) {
    // this is a dummy placeholder method
    throw new Error('Method not implemented');
  };
};

module.exports = BaseForecastingModel;