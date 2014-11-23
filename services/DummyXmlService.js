var Product = require('../models/Product');
var WeeklySale = require('../models/WeeklySale');

var DummyXmlService = function () {

  this.getProducts = function (callback) {
    var products = [];

    // generate reeses
    var reeses = new Product({
      type: 'candy',
      name: 'Reeses',
      retailPrice: 1.99,
      margin: 0.5
    });

    reeses.addWeeklySale(new WeeklySale({
      id: 1,
      quantity: 23,
      marketAverage: 20,
      numStores: 98
    }));

    reeses.addWeeklySale(new WeeklySale({
      id: 2,
      quantity: 33,
      marketAverage: 25,
      numStores: 50
    }));

    reeses.addWeeklySale(new WeeklySale({
      id: 3,
      quantity: 13,
      marketAverage: 25,
      numStores: 80,
      promo: true
    }));

    var hershey = new Product({
      type: 'candy',
      name: 'Hershey',
      retailPrice: 2.99,
      margin: 0.10
    });

    hershey.addWeeklySale(new WeeklySale({
      id: 1,
      quantity: 13,
      marketAverage: 60,
      numStores: 90
    }));

    hershey.addWeeklySale(new WeeklySale({
      id: 2,
      quantity: 13,
      marketAverage: 55,
      numStores: 90
    }));

    hershey.addWeeklySale(new WeeklySale({
      id: 3,
      quantity: 10,
      marketAverage: 105,
      numStores: 100,
      promo: true
    }));

    var mm = new Product({
      type: 'candy',
      name: 'M&M',
      retailPrice: 0.99,
      margin: 0.2
    });

    mm.addWeeklySale(new WeeklySale({
      id: 1,
      quantity: 53,
      marketAverage: 60,
      numStores: 5
    }));

    mm.addWeeklySale(new WeeklySale({
      id: 2,
      quantity: 53,
      marketAverage: 65,
      numStores: 30
    }));

    mm.addWeeklySale(new WeeklySale({
      id: 3,
      quantity: 73,
      marketAverage: 75,
      numStores: 60,
      promo: true
    }));

    products.push(reeses);
    products.push(hershey);
    products.push(mm);

    callback(products);
  }
}

module.exports = DummyXmlService;