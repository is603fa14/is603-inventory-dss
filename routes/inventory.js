var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/products', function(req, res) {
  var context = req.app.get('appContext');
  var dataService = context.get('dataService');

  dataService.getProducts(function (err, products) {
    res.render('inventory/products/index.hbs', { 
      title: 'Current Inventory',
      products: products 
    });
  });
});

module.exports = router;
