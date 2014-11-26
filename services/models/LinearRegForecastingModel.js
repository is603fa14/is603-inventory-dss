var util = require('util'); // include a system module (util: http://nodejs.org/api/util.html)
var _ = require('underscore');
var BaseForecastingModel = require('./BaseForecastingModel'); // include the base classs
var StatUtils = require('../../utils/StatUtils');

// class definition
var LinearRegForecastingModel = function () {
  // super constructor call 
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