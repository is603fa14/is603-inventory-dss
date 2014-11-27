var path = require('path');
var fs = require('fs');
var XmlService = require('./services/XmlService');
var ForecastingService = require('./services/ForecastingService');
var RecommenderService = require('./services/RecommenderService');
var SimpleForecastingModel = require('./services/models/SimpleForecastingModel');
var LinearRegForecastingModel = require('./services/models/LinearRegForecastingModel');
var TDistributionModel = require('./services/models/TDistributionModel');
var AverageWithPromotionModel = require('./services/models/AverageWithPromotionModel');
var SimpleRecommender = require('./services/recommenders/SimpleRecommender');

var Context = function () {
  this.textLookups = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/text_lookups.json')));

  // tools for forecasting future demand
	this.dataService =  new XmlService(path.join(__dirname, 'data/inventoryData.xml'))
	this.forecastingService = new ForecastingService(this.dataService);

	this.forecastingService.addModel('simple', new SimpleForecastingModel());
	this.forecastingService.addModel('linearRegression', new LinearRegForecastingModel());
  this.forecastingService.addModel('tDistribution', new TDistributionModel());
  this.forecastingService.addModel('avgWithPromo', new AverageWithPromotionModel());

  // tools for generating recommendations
  this.replacementDataService = new XmlService(path.join(__dirname, 'data/replacementData.xml'));
  this.recommenderService = new RecommenderService(this.replacementDataService);

  this.recommenderService.addRecommender('simple', new SimpleRecommender());
};

module.exports = new Context();