var assert = require('assert');
var _ = require('underscore');
var Product = require('../../models/Product');
var WeeklySale = require('../../models/WeeklySale');

// base class for all forecasting models
// (this would be an abstract class in Java)
// define any functionality that should be common to all models here
var BaseForecastingModel = function () {

  this.getWeeklySalesArr = function (product, options) {
    if (!_.isArray(product.weeklySales)) {
      return [];
    }

    var salesArr = _.pluck(product.weeklySales, 'quantity');

    if (!options) {
      options = {};
    }

    _.defaults(options, {
      numWeeks: undefined
    });

    if (options.numWeeks && options.numWeeks < salesArr.length) {
      salesArr = _.first(salesArr, options.numWeeks);
    }

    for (var i = 0; i < salesArr.length; i++) {
      var val = salesArr[i];
      if (!_.isNumber(val)) {
        salesArr[i] = parseFloat(val);
      }
    }

    return salesArr;
  };

  this.forecastDemand = function (forProduct) {
  	assert(forProduct instanceof Product, 'Unknown product model');
   
    var forecasted = this.getForecastedQuantity(forProduct);

    return new WeeklySale({
      quantity: forecasted.value,
      forecasted: true,
      debug: "Model calculations: " + 
        JSON.stringify(forecasted.debug, null, 4).trim()
    });    
  };

  this.getForecastedQuantity = function (forProduct) {
    // this is a dummy placeholder method
    throw new Error('Method not implemented');
  };
};

module.exports = BaseForecastingModel;