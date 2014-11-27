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
      var diff = num - avg;
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

StatUtils.tTable = {
  '.9': {
    1:  3.078, 2:  1.886, 3:  1.638, 4:  1.533, 5:  1.476, 6:  1.440, 7:  1.415,
    8:  1.397, 9:  1.383, 10: 1.372, 11: 1.363, 12: 1.356, 13: 1.350, 14: 1.345,
    15: 1.341, 16: 1.337, 17: 1.333, 18: 1.330, 19: 1.328, 20: 1.325 },
  '.95': {
    1:  6.314, 2:  2.920, 3:  2.353, 4:  2.132, 5:  2.015, 6:  1.943, 7:  1.895,
    8:  1.860, 9:  1.833, 10: 1.812, 11: 1.796, 12: 1.782, 13: 1.771, 14: 1.761,
    15: 1.753, 16: 1.746, 17: 1.740, 18: 1.734, 19: 1.729, 20: 1.725 },
  '.99': {
    1:  31.82, 2:  6.965, 3:  4.541, 4:  3.747, 5:  3.365, 6:  3.143, 7:  2.998,
    8:  2.896, 9:  2.821, 10: 2.764, 11: 2.718, 12: 2.681, 13: 2.650, 14: 2.624,
    15: 2.602, 16: 2.583, 17: 2.567, 18: 2.552, 19: 2.539, 20: 2.528 }
};

StatUtils.tValue = function (confidenceInterval, degreesOfFreedom) {
  if (!confidenceInterval || !degreesOfFreedom) {
    return;
  }

  confidenceInterval = confidenceInterval.toString();
  degreesOfFreedom = parseInt(degreesOfFreedom);

  if (_.has(StatUtils.tTable, confidenceInterval)) {
    var tRow = StatUtils.tTable[confidenceInterval];

    if (_.has(tRow, degreesOfFreedom)) {
      return tRow[degreesOfFreedom];
    }
  }
};

StatUtils.degreesOfFreedom = function (arr) {
  if (!_.isArray(arr)) {
    return;
  }

  return arr.length - 1;
};

StatUtils.getUpperTLimit = function (arr, options) {
  if (!_.isArray(arr)) {
    return;
  }

  if (!options) {
    options = {};
  }

  _.defaults(options, {
    confidenceInterval: '.95'
  });

  var mean = StatUtils.mean(arr);
  var stdDeviation = StatUtils.stdDeviation(arr);
  var dof = StatUtils.degreesOfFreedom(arr);
  var t = StatUtils.tValue(options.confidenceInterval, dof);

  if (_.isNumber(t)) {
    var upperLimit = mean + ((t * stdDeviation) / Math.sqrt(arr.length));
    return {
      value: upperLimit,
      degreesOfFreedom: dof,
      t: t,
      mean: mean,
      stdDeviation: stdDeviation,
      confidenceInterval: options.confidenceInterval
    };
  }
};

module.exports = StatUtils;