var assert = require('assert');
var _ = require('underscore');
var WeeklySale = require('./WeeklySale');

var Product = function (values) {
  _.defaults(values, {
    type: null,
    name: null,
    retailPrice: null,
    margin: null,
    weeklySales: []
  });
  _.extend(this, values);

  this.addWeeklySale = function (weeklySale) {
    assert(weeklySale instanceof WeeklySale, 'Unexpected data type');
    this.weeklySales.push(weeklySale);
  }
};

module.exports = Product;