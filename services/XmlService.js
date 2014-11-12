var assert = require('assert'); // helpers for assertions 
var fs = require('fs');         // file system 
var _ = require('underscore');  // http://underscorejs.org/#

var XmlService = function (fileName) {
  // filename must be a string, and must point to a real file
  assert(_.isString(fileName), "File name must be a path to an XML file");
  this.fileName = fileName;

  this.getProducts = function () {
    var fileContents = fs.readFileSync(this.fileName);
    var products = [];
    // TODO parse contents into product array
    // TODO define product class
    // (both of these depends on the spreadsheet format)
    return products;
  };
};

module.exports = XmlService;