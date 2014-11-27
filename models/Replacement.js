var _ = require('underscore');

var Replacement = function (values) {
  _.defaults(values, {
    product: null,
    justification: [],
    rating: 0
  });
  _.extend(this, values);
};

module.exports = Replacement;