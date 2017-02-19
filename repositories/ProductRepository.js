'use strict';

var db = require('../models/sequelize');
var repo = {};

repo.createProduct = function(product) {

	  var dbProduct = db.Product.build(product);

      return dbProduct.save();
};

module.exports = repo;