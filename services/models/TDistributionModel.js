var util = require('util');
var BaseForecastingModel = require('./BaseForecastingModel');
var StatUtils = require('../../utils/StatUtils');

var TDistributionModel = function () {
  BaseForecastingModel.call(this);

  this.getForecastedQuantity = function (weeks, product, options) {
    var upperLimit = StatUtils.getUpperTLimit(weeks, options);
    var result = {
      value: Math.ceil(upperLimit.value),
      debug: {
        numWeeks: weeks.length,
        raw: upperLimit.value,
        degreesOfFreedom: upperLimit.degreesOfFreedom,
        t: upperLimit.t,
        mean: upperLimit.mean,
        stdDeviation: upperLimit.stdDeviation,
        confidenceInterval: upperLimit.confidenceInterval
      }
    };

    return result;
  };
};

util.inherits(TDistributionModel, BaseForecastingModel);

module.exports = TDistributionModel;