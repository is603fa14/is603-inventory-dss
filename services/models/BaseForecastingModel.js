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
      weeksBack: undefined
    });

    if (options.weeksBack && options.weeksBack < salesArr.length) {
      salesArr = _.first(salesArr, options.weeksBack);
    }

    for (var i = 0; i < salesArr.length; i++) {
      var val = salesArr[i];
      if (!_.isNumber(val)) {
        salesArr[i] = parseFloat(val);
      }
    }

    return salesArr;
  };

  this.forecastDemand = function (forProduct, options) {
  	assert(forProduct instanceof Product, 'Unknown product model');

    var sales = this.getWeeklySalesArr(forProduct, options);
    var forecasted = this.getForecastedQuantity(sales, forProduct, options);

    return new WeeklySale({
      quantity: forecasted.value,
      forecasted: true,
      promo: this.isPromo(forProduct),
      debug: "Model calculations: " + 
        JSON.stringify(forecasted.debug, null, 4).trim()
    });    
  };

  this.isPromo = function (product) {
    return false;
  };

  this.getForecastedQuantity = function (forProduct) {
    // this is a dummy placeholder method
    throw new Error('Method not implemented');
  };
};

module.exports = BaseForecastingModel;