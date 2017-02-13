"use strict";


var config = require('../config/product.js');

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

