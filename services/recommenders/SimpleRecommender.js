var util = require('util');
var _ = require('underscore');
var BaseRecommender = require('./BaseRecommender');
var Replacement = require('../../models/Replacement');
var OrderAmount = require('../../models/OrderAmount');
var StatUtils = require('../../utils/StatUtils');

var SimpleRecommender = function () {
  BaseRecommender.call(this);

  this.getReplacement = function (product, replacements, options) {
    var candidates = [];
    var avgMarketSales;
    var avgStores;
    var bestReplacement;
    var i;

    if (!_.isArray(replacements)) {
      return;
    }

    _.defaults(options, {
      tolerance: 5
    });

    avgMarketSales = StatUtils.mean(this.getWeeklyPropertyArr(
      options.previousWeeks, { property: 'marketAverage' }));
    avgStores = StatUtils.mean(this.getWeeklyPropertyArr(
      options.previousWeeks, { property: 'numStores' }));
    i = 0;

    for (i = 0; i < replacements.length; i++) {
      var candidate = new Replacement({ product: replacements[i] });

      if (candidate.product.marketAverage > options.nextWeek.quantity) {
        // this candy seems to be performing better
        candidate.rating += 1;
        candidate.justification.push(util.format(
          "The market performance of %s (%d average sales/week) " +
          "outperforms the projected performance of %s next week (%d sales).",
          candidate.product.name, candidate.product.marketAverage,
          product.name, options.nextWeek.quantity));
      }

      if (candidate.product.marketAverage + options.tolerance > options.nextWeek.quantity) {
        // this candy seems to be roughly similar
        if (candidate.numStores < avgStores) {
          // this candy seems to be unique in the market
          candidate.rating += 1;
          candidate.justification.push(util.format(
            "The market performance of %s (%d average sales) and %s " +
            "(%d projected sales) are roughly similar.",
            candidate.product.name, candidate.product.marketAverage,
            product.name, options.nextWeek.quantity));
          candidate.justification.push(util.format(
            "The market saturation of %s (%d stores) is lower than the " +
            "market saturation of %s (%d stores).  Replacing a common " +
            "product with a less common product may meet unsatisifed demand, " +
            "and increase sales.", 
            candidate.product.name, candidate.product.numStores,
            product.name, avgStores));
        }
      }

      if (options.nextWeek.quantity < avgMarketSales && 
          candidate.product.marketAverage > avgMarketSales) {
        candidate.rating += 1;
        candidate.justification.push(util.format(
          "The forecasted demand for %s next week is lower than the " +
          "average market sales for this market (%d sales across %d stores). " +
          "The market average for %s is greater (%d), making it a worthwhile " + 
          "candidate for replacement.", 
          product.name, avgMarketSales, avgStores, 
          candidate.product.name, candidate.product.marketAverage));
      }

      if (candidate.rating > 0) {
        candidates.push(candidate);
      }
    }

    var replacement;

    if (!_.isEmpty(candidates)) {
      replacement = _.max(candidates, function (replacement) {
        return replacement.rating;
      });


      if (!_.isObject(replacement)) {
        replacement = null;
      }
    }

    return replacement;
  };

  this.getOrderAmount = function (product, options) {
    var inventory = (product.inventory) ? product.inventory : 0
    var orderAmount = new OrderAmount({});

    _.defaults(options, {
      unitsPerCase: undefined
    });

    orderAmount.demand = options.nextWeek.quantity - inventory;

    if (orderAmount.demand > 0) {
      var caseShortage = (options.unitPerCase) 
        ? options.unitsPerCase - (orderAmount.demand % options.unitsPerCase)
        : 0;

      orderAmount.quantity = orderAmount.demand;
      orderAmount.justification.push(util.format(
        "The forecasted demand for next week is %d, but there are %d " + 
        "remaining in inventory; it is necessary to order %d more to meet " + 
        "the forecasted demand.", options.nextWeek.quantity, inventory, 
        orderAmount.demand));

      if (caseShortage > 0) {
        orderAmount.quantity += caseShortage;
        orderAmount.justification.push(util.format(
          "Orders must be given by case, and each case contains %d products." + 
          "It is necessary to order an additional %d products to meet the " + 
          "minimum order quantity.", options.unitsPerCase, caseShortage));
      }
    } else {
      orderAmount.quantity = 0;
      orderAmount.justification.push(util.format(
        "There is not enough demand to justify ordering any more products; " + 
        "the amount remaining in inventory (%d) will cover the forecasted " +
        "demand for next week (%d).", inventory, options.nextWeek.quantity));
    }

    return orderAmount;
  };
};

util.inherits(SimpleRecommender, BaseRecommender);

module.exports = SimpleRecommender;