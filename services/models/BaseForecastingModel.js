
// base class for all forecasting models
// (this would be an abstract class in Java)
// define any functionality that should be common to all models here
var BaseForecastingModel = function () {

  this.forecastDemand = function (forProduct) {
    // this is a dummy placeholder method
    throw new Error('Method not implemented');
  };
};

module.exports = BaseForecastingModel;