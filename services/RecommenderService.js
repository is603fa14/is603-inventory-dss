var assert = require('assert');
var _ = require('underscore');
var BaseRecommender = require('./recommenders/BaseRecommender');

var RecommenderService = function (databaseService) {
  assert(_.contains(_.functions(databaseService), 'getProducts'),
    'Database service must have function getProducts()');
  this.databaseService = databaseService;
  this.recommenders = {};

  this.addRecommender = function (name, recommender) {
    if (!_.isString(name) || !(recommender instanceof BaseRecommender)) {
      return;
    }

    this.recommenders[name] = recommender;
  };

  this.getRecommender = function (name) {
    if (!this.hasRecommender(name)) {
      return;
    }

    return this.recommenders[name];
  };

  this.getRecommenderNames = function () {
    return _.keys(this.recommenders);
  };

  this.hasRecommender = function (name) {
    return this.recommenders.hasOwnProperty(name);
  };

  this.getReplacements = function (callback) {
    this.databaseService.getProducts(_.bind(callback, this));
  };

  this.makeRecommendation = function (recommender, products, options, callback) {
    assert(_.contains(_.functions(recommender), 'generateRecommendation'),
      'Recommender must have function generateRecommendation()');
    assert(_.isArray(products), 'Products must be an array');

    if (!callback) {
      callback = _.noop;
    }

    if (!options) {
      options = {};
    }

    _.defaults(options, {});

    this.getReplacements(function (err, replacements) {
      if (err) {
        callback(err);
        return;
      }

      // sort by quantity, so that lowest quantities are replaced first
      var sorted = _.sortBy(products, function (val) {
        return val.weeklySales[0].quantity;
      });

      for (var i = 0; i < sorted.length; i++) {
        var product = sorted[i];
        product.recommendation = recommender.generateRecommendation(product,
          replacements, options);

        if (product.recommendation.replaceWith) {
          // remove the replacement from the array of available replacements
          var found = false;
          var j = 0;
          var matches = function (obj, candidate) {
            return obj.name === candidate.name;
          };

          while (!found && j < replacements.length) {
            var replacement = replacements[j];

            if (matches(product.recommendation.replaceWith.product, replacement)) {
              replacements.splice(j, 1);
              found = true;
            }

            j += 1;
          }
        }
      }

      callback(null, products);
    });
  };
};

module.exports = RecommenderService;