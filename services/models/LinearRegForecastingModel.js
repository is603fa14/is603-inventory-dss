var util = require('util'); 
var BaseForecastingModel = require('./BaseForecastingModel'); 
var StatUtils = require('../../utils/StatUtils');

var LinearRegForecastingModel = function () {
  BaseForecastingModel.call(this);

  this.getForecastedQuantity = function (weeks, product, options) {
    var bestFit = StatUtils.bestFit(weeks);
    var value = bestFit.f(weeks.length + 1);

    var result = {
      value: Math.ceil(value),
      debug: {   
        numWeeks: weeks.length,
        bestFit: bestFit,
        raw: value
      }
    };
    
    return result;
  };
};

util.inherits(LinearRegForecastingModel, BaseForecastingModel);

module.exports = LinearRegForecastingModel;