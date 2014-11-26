var _ = require('underscore');

var StatUtils = function () { };

StatUtils.mean = function (arr) {
	if (!_.isArray(arr)) {
		return;
	}

	var sum = _.reduce(arr, function (memo, num) {
		return memo + num;
	});

	return sum / arr.length;
};

StatUtils.variance = function (arr, options) {
	if (!_.isArray(arr)) {
		return;
	}

	var varianceSum;
	var avg;

	if (!options) {
		options = {};
	}

	avg = (_.isNumber(options.avg)) ? options.avg : StatUtils.mean(arr);

	varianceSum = _.reduce(arr, function (memo, num) {
      var diff = num - options.avg;
      return memo + Math.pow(diff, 2);
    }, 0);

    return varianceSum / arr.length;
};

StatUtils.stdDeviation = function (arr, options) {
	if (!_.isArray(arr)) {
		return;
	}

	var variance;

	if (!options) {
		options = {};
	}

	variance = (_.isNumber(options.variance)) 
		? options.variance : StatUtils.variance(arr, options);

	return Math.sqrt(variance);
};

StatUtils.bestFit = function (arr, options) {
	if (!_.isArray(arr)) {
		return;
	}

	if (!options) {
		options = {};
	}

	var weeks = _.range(arr.length);
    var meanWeeks = StatUtils.mean(weeks);
    var meanSales = (_.isNumber(options.avg)) 
    	? options.avg : StatUtils.mean(arr);
    var slopeVals = {rise: 0, run: 0};
    var slope;
    var trend;
    var yInt;

    for (var i = 0; i < arr.length; i++) {
      var salesVal = arr[i];
      var weekVal = weeks[i];

      slopeVals.rise += (weekVal - meanWeeks) * (salesVal - meanSales);
      slopeVals.run += Math.pow(weekVal - meanWeeks, 2);
    }

    slope = slopeVals.rise / slopeVals.run;
    yInt = meanSales - (slope * meanWeeks);

    return {
    	m: slope,
    	b: yInt,
    	f: function (x) {
    		return this.m * x + this.b;
    	}
    };
};

StatUtils.trend = function (arr, options) {
	if (!_.isArray(arr)) {
		return;
	}

	var tolerance = {low: 0, high: 0};
	var bestFit;
	var slope;

	if (!options) {
		options = {};
	}

	_.defaults(options, {tolerance: 0});

	bestFit = (_.isObject(options.bestFit)) 
		? options.bestFit : StatUtils.bestFit(arr, options);
	slope = bestFit.m;

	options.tolerance = Math.abs(options.tolerance);
    tolerance.low -= options.tolerance;
    tolerance.high += options.tolerance;

	if (slope > tolerance.high) {
      trend = 1;
    } else if (slope < tolerance.low) {
      trend = -1;
    } else {
      trend = 0;
    }

    return trend;
};

module.exports = StatUtils;