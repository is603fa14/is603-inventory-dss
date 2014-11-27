var assert = require('assert');
var _ = require('underscore');
var Product = require('../../models/Product');
var Recommendation = require('../../models/Recommendation');

var BaseRecommender = function () {

  this.generateRecommendation = function (product, replacements, options) {
    var recommendation = new Recommendation({});
    assert(product instanceof Product, 'Unknown product model');

    if (!options) {
      options = {};
    } else {
      options = _.clone(options);
    }

    options.previousWeeks = this.getPreviousWeeks(product);
    options.forecastedWeeks = this.getForecastedWeeks(product);
    options.thisWeek = options.previousWeeks[0];
    options.nextWeek = options.forecastedWeeks[options.forecastedWeeks.length - 1];

    recommendation.replaceWith = this.getReplacement(product, replacements,
      options);

    if (!recommendation.replaceWith) {
      recommendation.orderQuantity = this.getOrderAmount(product, options);
    }

    return recommendation;
  };

  // placeholder
  this.getReplacement = function (product, replacements, options) { };

  // placeholder
  this.getOrderAmount = function (product, options) { };

  this.getWeeklyPropertyArr = function (weeks, options) {
    var quantities;

    if (!_.isArray(weeks)) {
      return;
    }

    if (!options) {
      options = {};
    }

    _.defaults(options, { 
      weeksBack: weeks.length,
      property: 'quantity'
    });

    quantities = _.pluck(weeks, options.property);

    if (options.weeksBack && options.weeksBack < quantities.length) {
      quantities = _.first(quantities, options.weeksBack);
    }

    for (var i = 0; i < quantities.length; i++) {
      var val = quantities[i];
      if (!_.isNumber(val)) {
        quantities[i] = parseFloat(val);
      }
    }

    return quantities;
  };

  this.getPreviousWeeks = function (product) {
    if (!product || !_.isArray(product.weeklySales)) {
      return;
    }

    return _.filter(product.weeklySales, function (val) {
      return !val.forecasted;
    });
  };

  this.getForecastedWeeks = function (product) {
    if (!product || !_.isArray(product.weeklySales)) {
      return;
    }

    return _.filter(product.weeklySales, function (val) {
      return val.forecasted;
    });
  }
};

module.exports = BaseRecommender;