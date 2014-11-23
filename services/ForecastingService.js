var assert = require('assert');
var _ = require('underscore');
var BaseForecastingModel = require('./models/BaseForecastingModel');

// controller must pass in the database at instantiation
// this makes it easy to test - can easily pass in dummy databases without 
// needing the XML files to be finished yet
var ForecastingService = function (databaseService) {
  // determine that the database service has the getProducts() function
  assert(_.contains(_.functions(databaseService), 'getProducts'), 
    'Database service must have function getProducts()');
  this.databaseService = databaseService;
  this.models = {};

  this.addModel = function (name, model) {
    if (!_.isString(name) || !(model instanceof BaseForecastingModel)) {
      return;
    }

    this.models[name] = model;
  };

  this.getModel = function (name) {
    if (!this.hasModel(name)) {
      return;
    }

    return this.models[name];
  };

  this.getModelNames = function () {
    return _.keys(this.models);
  };

  this.hasModel = function (name) {
    return this.models.hasOwnProperty(name);
  };

  this.getProducts = function (callback) {
    this.databaseService.getProducts(_.bind(callback, this));
  };

  // the controller will call this method to do the actual work 
  // controller must pass the model - this means that the controller can 
  // choose which model to use
  // the model does the actual forecasting, this method just handles the 
  // logistics 
  this.forecastOrders = function (model, options, callback) {
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
    this.getProducts(function (products) {
      for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var demand = model.forecastDemand(product);

        // store the forecasted sale amount in the product
        product.addForecastedSale(demand);
      }

      callback(null, products);
    });
  };

};

module.exports = ForecastingService;