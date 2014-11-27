var _ = require('underscore');

var OrderAmount = function (values) {
  _.defaults(values, {
    demand: null,
    quantity: null,
    justification: []
  });
  _.extend(this, values);
};

module.exports = OrderAmount;