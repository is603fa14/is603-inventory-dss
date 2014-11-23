var util = require('util'); // include a system module (util: http://nodejs.org/api/util.html)
var BaseForecastingModel = require('./BaseForecastingModel'); // include the base class

// class definition
var SimpleForecastingModel = function () {
  // super constructor call 
  BaseForecastingModel.call(this);

  // TODO add code here

  this.foobar = function (x) {
    // this is a sample instance function
    // it multiplies the input by 2

    if (!x) {
      // x was not provided, so return undefined (or null)
      return undefined;
    }

    return x * 2;
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