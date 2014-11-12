var assert = require('assert');
var _ = require('underscore');

// controller must pass in the database at instantiation
// this makes it easy to test - can easily pass in dummy databases without 
// needing the XML files to be finished yet
var ForecastingService = function (databaseService) {
  // determine that the database service has the getProducts() function
  assert(_.contains(_.functions(databaseService), 'getProducts'), 
    'Database service must have function getProducts()');
  this.databaseService = databaseService;

  this.getProducts = function () {
    var products = this.databaseService.getProducts();

    // guarentee to return an array
    return (_.isArray(products)) ? products : [];
  };

  // the controller will call this method to do the actual work 
  // controller must pass the model - this means that the controller can 
  // choose which model to use
  // the model does the actual forecasting, this method just handles the 
  // logistics 
  this.forecastOrders = function (model, options) {
    // options argument: an object of options - this allows us to easily 
    // add new parameters in the future

    // ensure that the model is valid
    assert(_.contains(_.functions(model), 'forecastDemand'),
      'Model must have function forecastDemand()');

    // define any default options here
    // this means that if the user does not pass in any options in the 
    // options parameter, we can set defaults for them
    var defaultOptions = {
      numWeeks: 1
    };

    // set the default options if not passed in by the user
    _.defaults(options, defaultOptions);

    // get the products 
    var products = this.getProducts();

    // this will store the forecasts
    var forecasts = [];

    for (var i = 0; i < products.length; i++) {
      var product = products[i];
      var demand = model.forecastDemand(product);

      // TODO do any additional processing on the forecast

      // store demand in array
      forecasts.push(demand);
    }

    return forecasts;
  };

};

module.exports = ForecastingService;