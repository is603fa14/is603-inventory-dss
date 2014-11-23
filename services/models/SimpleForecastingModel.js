var util = require('util'); // include a system module (util: http://nodejs.org/api/util.html)
var _ = require('underscore');
var BaseForecastingModel = require('./BaseForecastingModel'); // include the base classs

// class definition
var SimpleForecastingModel = function () {
  // super constructor call 
  BaseForecastingModel.call(this);

  this.getWeeklySalesArr = function (product, options) {
    if (!_.isArray(product.weeklySales)) {
      return [];
    }

    var salesArr = _.pluck(product.weeklySales, 'quantity');

    if (!options) {
      options = {};
    }

    _.defaults(options, {
      numWeeks: undefined
    });

    if (options.numWeeks && options.numWeeks < salesArr.length) {
      salesArr = _.first(salesArr, options.numWeeks);
    }

    for (var i = 0; i < salesArr.length; i++) {
      var val = salesArr[i];
      if (!_.isNumber(val)) {
        salesArr[i] = parseFloat(val);
      }
    }

    return salesArr;
  };

  this.calculateAverage = function (salesArr) {
    if (!_.isArray(salesArr)) {
      return;
    }

    var sum = _.reduce(salesArr, function (memo, num) {
      return memo + num;
    });

    return sum / salesArr.length;
  };

  this.calculateVariance = function (salesArr, avg) {
    if (!_.isArray(salesArr) || !_.isNumber(avg)) {
      return;
    }

    var varianceSum = _.reduce(salesArr, function (memo, num) {
      var diff = num - avg;
      return memo + Math.pow(diff, 2);
    });

    return varianceSum / salesArr.length;
  };

  this.calculateStdDeviation = function (salesArr, avg) {
    if (!_.isArray(salesArr) || !_.isNumber(avg)) {
      return;
    }

    var variance = this.calculateVariance(salesArr, avg);

    return Math.sqrt(variance);
  };

  this.getForecastedQuantity = function (forProduct) {
    var salesArr = this.getWeeklySalesArr(forProduct);
    var average = this.calculateAverage(salesArr);
    var stdDeviation = this.calculateStdDeviation(salesArr, average);
    
    return Math.ceil(average + stdDeviation);
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