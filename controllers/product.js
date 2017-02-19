"use strict";


var config = require('../config/product.js');
var ProductRepo = require('../repositories/ProductRepository.js');
/**
 * GET /products
 * Product display page.
 */
exports.getProducts = function(req, res) {
  var pageSize = config.product.PAGING_SIZE;
  var page = req.query.page || 1;

  if(!req.user) {
      req.flash('errors', { msg: "Please login to view Products" });
      return res.redirect('/login');  
  }

  // res.render('contact', {
  //   title: 'Contact'
  // });
};

exports.getCreateProduct = function(req, res) {


  if(!req.user || req.user.RoleId != 2) {
      req.flash('errors', { msg: "Bad credentials" });
      return res.redirect('/');  
  }

  res.render('product/create', {title: 'Create Product'});

  // res.render('contact', {
  //   title: 'Contact'
  // });
};

exports.postCreateProduct = function(req, res) {
  req.assert('price', 'required').notEmpty();
  req.assert('title', 'required').notEmpty().len(4);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/agent/product/create');
  }


  ProductRepo.createProduct({
    price : req.body.price,
    discount: parseInt(req.body.discount),
    quantity: 0,
    description: req.body.description,
    title: req.body.title,
    currency: req.body.currency,
    sizes: parseInt(req.body.sizes) || 0,
    sizem: parseInt(req.body.sizem) || 0,
    sizel: parseInt(req.body.sizel) || 0,
    sizexl: parseInt(req.body.sizexl) || 0,
    sizexll: parseInt(req.body.sizexll) || 0,
    imageurl: req.file.filename
  }).then(function(product) {

  		req.flash('success', {msg: 'Product saved'});
  		res.redirect('/products', {title: "ss"});

  }).catch(function(err) {

      req.flash('errors', { msg: err });
      return res.redirect('create');

  })
}


exports.getProductsList = function(req, res) {
  var productList = null;
  ProductRepo.getProducts()
  .then(function(list) {

    productList = list;
    res.render('product/products', {title: 'Products Dashboard', productList: productList})
  
  })
  .catch(function(err) {

    req.flash('errors', {msg: err});
    res.render('product/products', {title: 'Products Dashboard', productList: productList})
  
  })
  
}

