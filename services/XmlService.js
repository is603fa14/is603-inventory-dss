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
        var xml_products=result.products.product;
        
        for(var key in xml_products)
        {
            var xmlproduct = xml_products[key];
            var product = new Product({
                type: xmlproduct['$']['type'],
                name: xmlproduct['$']['name'],
                retailPrice: xmlproduct['retailPrice'],
                margin: xmlproduct['margin']
            });
        
            for (var weekKey in xmlproduct['week']) {
                var xmlweek = xmlproduct['week'][weekKey];
                var week = new WeeklySale({
                    id: xmlweek['$']['id'],
                    quantity: xmlweek['qty'],
                    marketAverage: xmlweek['mkavg'],
                    numStores: xmlweek['nos'],
                    promo: xmlweek['$']['promo']
                });
        
                product.addWeeklySale(week);
            }
            products.push(product);
        
        }
        
        callback(products);

	});
  }
};

module.exports = XmlService;