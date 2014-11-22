var _ = require('underscore');

var WeeklySale = function (values) {
  _.defaults(values, {
    quantity: null,
    marketAverage: null,
    numOfSales: null
  });
  _.extend(this, values);
};

module.exports = WeeklySale;