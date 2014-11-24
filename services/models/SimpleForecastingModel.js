var util = require('util'); // include a system module (util: http://nodejs.org/api/util.html)
var _ = require('underscore');
var BaseForecastingModel = require('./BaseForecastingModel'); // include the base classs
var StatUtils = require('../../utils/StatUtils');

// class definition
var SimpleForecastingModel = function () {
  // super constructor call 
  BaseForecastingModel.call(this);

  this.getForecastedQuantity = function (forProduct) {
    var salesArr = this.getWeeklySalesArr(forProduct);
    var average = StatUtils.mean(salesArr);
    var stdDeviation = StatUtils.stdDeviation(salesArr, {avg: average});
    var trend = 1;
    var value = average + (trend * stdDeviation);

    var result = {
      value: Math.ceil(value),
      debug: {
        average: average,
        stdDeviation: stdDeviation,
        trend: trend,
        raw: value
      }
    };
    
    return result;
  };
};

// class inheritence
// this class (SimpleForecastingModel) will inherit from BaseForecastingModel
util.inherits(SimpleForecastingModel, BaseForecastingModel);

// sample usage:
// var model = new SimpleForecastingModel();
// console.log(model.foobar(2)); // prints out 4

// export this class
module.exports = SimpleForecastingModel;