var _ = require('underscore');

var Recommendation = function (values) {
  _.defaults(values, {
    orderQuantity: null,
    replaceWith: null
  });
  _.extend(this, values);
};

module.exports = Recommendation;