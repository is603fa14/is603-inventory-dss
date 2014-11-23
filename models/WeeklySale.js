var _ = require('underscore');

var WeeklySale = function (values) {
  _.defaults(values, {
    id: null,
    quantity: null,
    marketAverage: null,
    numStores: null,
    promo: false,
    forecasted: false
  });
  _.extend(this, values);
};

module.exports = WeeklySale;