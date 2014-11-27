var util = require('util');
var _ = require('underscore');
var BaseForecastingModel = require('./BaseForecastingModel');
var StatUtils = require('../../utils/StatUtils');

var AverageWithPromotionModel = function () {
  BaseForecastingModel.call(this);

  this.getForecastedQuantity = function (weeks, product, options) {
    var avg;
    var forecast;
    var normalizedWeeks = [];
    
    _.defaults(options, {
      promoQuantity: 3,
      promoGrowth: .25
    });

    for (var i = 0; i < weeks.length; i++) {
      var week = product.weeklySales[i];
      if (week.promo) {
        normalizedWeeks[i] = weeks[i] / options.promoQuantity;
      } else {
        normalizedWeeks[i] = weeks[i];
      }
    }

    avg = StatUtils.mean(normalizedWeeks);

    if (product.weeklySales[0].promo) {
      // last week was a promo, continue the promo
      // promoQuantity is the amount of candies included in the promo
      // (i.e., buy one get 2 free)
      // promoGrowth is the opportunity for promotional candies 
      forecast = (avg * options.promoQuantity) + (avg * options.promoGrowth);
    } else {
      forecast = avg;
    }

    return {
      value: Math.ceil(forecast),
      debug: {
        numWeeks: weeks.length,
        mean: avg,
        raw: forecast,
        promoQuantity: options.promoQuantity,
        promoGrowth: options.promoGrowth
      }
    };
  };

  this.isPromo = function (product) {
    return product.weeklySales[0].promo;
  };
};

util.inherits(AverageWithPromotionModel, BaseForecastingModel);

module.exports = AverageWithPromotionModel;