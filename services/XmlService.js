var assert = require('assert'); // helpers for assertions 
var fs = require('fs');         // file system 
var _ = require('underscore');  // http://underscorejs.org/#
var parseString = require('xml2js').parseString;
var Product = require('../models/Product');
var WeeklySale = require('../models/WeeklySale');

var XmlService = function (fileName) {
  // filename must be a string, and must point to a real file
  assert(_.isString(fileName), "File name must be a path to an XML file");
  this.fileName = fileName;

  this.getProducts = function (callback) {
    var fileContents = fs.readFileSync(this.fileName);
    var products = [];

    parseString(fileContents,function(err,result) {
        if (err) {
            callback(err);
            return;
        }

        var xmlProducts = result.products.product;
        
        for(var key in xmlProducts) {
            var xmlProduct = xmlProducts[key];
            var product = new Product({
                type: xmlProduct['$']['type'],
                name: xmlProduct['$']['name'],
                description: xmlProduct['description'],
                retailPrice: xmlProduct['retailPrice'],
                margin: xmlProduct['margin'],
                inventory: xmlProduct['inventory']
            });
        
            for (var weekKey in xmlProduct['week']) {
                var xmlWeek = xmlProduct['week'][weekKey];
                var week = new WeeklySale({
                    id: xmlWeek['$']['id'],
                    quantity: xmlWeek['qty'],
                    marketAverage: xmlWeek['mkavg'],
                    numStores: xmlWeek['nos'],
                    promo: xmlWeek['$']['promo']
                });
        
                product.addWeeklySale(week);
            }
            products.push(product);
        
        }
        
        callback(null, products);
	});
  }
};

module.exports = XmlService;