var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var name = req.query['name'];
  if (!name) {
    name = 'World';
  }
  res.render('index', { 
    title: 'Welcome!',
    name: name
  });
});

module.exports = router;
