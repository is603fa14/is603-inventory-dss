var util = require('util');
var _ = require('underscore');
var BaseForecastingModel = require('./BaseForecastingModel');
var StatUtils = require('../../utils/StatUtils');

var MaximumWithPromotionModel = function () {
  BaseForecastingModel.call(this);

  this.getForecastedQuantity = function (weeks, product, options) {
    var max;
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

    max = StatUtils.max(normalizedWeeks);

    if (product.weeklySales[0].promo) {
      // last week was a promo, continue the promo
      // promoGrowth is the opportunity for promotional candies 
      forecast = max + (max * options.promoGrowth);
    } else {
      forecast = max;
    }

    return {
      value: Math.ceil(forecast),
      debug: {
        numWeeks: weeks.length,
        max: max,
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

util.inherits(MaximumWithPromotionModel, BaseForecastingModel);

module.exports = MaximumWithPromotionModel;