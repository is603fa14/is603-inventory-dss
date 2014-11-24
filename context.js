var path = require('path');
var XmlService = require('./services/XmlService');
var ForecastingService = require('./services/ForecastingService');
var SimpleForecastingModel = require('./services/models/SimpleForecastingModel');
var LinearRegForecastingModel = require('./services/models/LinearRegForecastingModel');

var Context = function () {
	this.dataService =  new XmlService(path.join(__dirname, 'data/inventoryData.xml'))
	this.forecastingService = new ForecastingService(this.dataService);

	this.forecastingService.addModel('simple', new SimpleForecastingModel());
	this.forecastingService.addModel('linearRegression', new LinearRegForecastingModel());
};

module.exports = new Context();