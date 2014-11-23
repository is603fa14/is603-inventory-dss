var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
  var context = req.app.get('appContext');
  var dataService = context.get('dataService');

  dataService.getProducts(function (products) {
    res.render('inventory/index', { 
      title: 'Current Inventory',
      products: products 
    });
  });
});

module.exports = router;
