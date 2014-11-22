var express = require('express');
var router = express.Router();
var path = require('path');

// import the XML service to act as the database
var XmlService = require('../services/DummyXmlService');

router.get('/', function(req, res) {
  var dataService = new XmlService();

  dataService.getProducts(function (err, products) {
    res.send(products);
  });
});

module.exports = router;
