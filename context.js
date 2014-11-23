var path = require('path');
var XmlService = require('./services/XmlService');
var ForecastingService = require('./services/ForecastingService');
var SimpleForecastingModel = require('./services/models/SimpleForecastingModel');

var Context = function () {
	this.dataService =  new XmlService(path.join(__dirname, 'data/inventoryData.xml'))
	this.forecastingService = new ForecastingService(this.dataService);

	this.forecastingService.addModel('simple', new SimpleForecastingModel());
};

module.exports = new Context();