var express = require('express');
var router = express.Router();
var path = require('path');

var getDataService = function (request) {
  return request.app.get('appContext').replacementDataService;
};

router.get('/', function (req, res, next) {
  var dataService = getDataService(req);

  dataService.getProducts(function (err, products) {
    if (err) {
      next(err);
      return;
    }

    res.render('vendors/index', {
      title: 'Available Vendor Products',
      products: products
    });
  });
});

router.get('/source', function (req, res, next) {
  var xmlService = getDataService(req);
  var xml = xmlService ? xmlService.getXML() : null;

  if (!xml) {
    next(new Error('XML file not found'));
    return;
  }

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

module.exports = router;