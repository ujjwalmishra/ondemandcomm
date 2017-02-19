'use strict';

var db = require('../models/sequelize');
var repo = {};

repo.createProduct = function(product) {

	  var dbProduct = db.Product.build(product);

      return dbProduct.save();
};

repo.getProducts = function() {

	return db.Product.findAll()
	.then(function(list){
		return list;
	})
	.catch(function(err) {
		throw err;
	})
}

module.exports = repo;