var assert = require('assert');
var _ = require('underscore');
var WeeklySale = require('./WeeklySale');

var Product = function (values) {
  _.defaults(values, {
    type: null,
    name: null,
    description: null,
    retailPrice: null,
    margin: null,
    inventory: null,
    weeklySales: []
  });
  _.extend(this, values);

  this.addWeeklySale = function (weeklySale) {
    assert(weeklySale instanceof WeeklySale, 'Unexpected data type');
    this.weeklySales.push(weeklySale);
  };

  this.addForecastedSale = function (forecastedSale) {
    assert(forecastedSale instanceof WeeklySale, 'Unexpected data type');
    forecastedSale.forecasted = true;
    this.weeklySales.unshift(forecastedSale);
  };
};

module.exports = Product;