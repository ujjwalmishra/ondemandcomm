'use strict';

var crypto;
var async = require('neo-async');
var passport = require('../config/passport_agent').passport;

var AdminRepo = require('../repositories/AdminRepository.js');
var emailService = require('../services/emailService.js');


exports.getCreateAgent = function(req, res) {
  res.render('admin/create', {title: "Creata Agent"});
}

exports.postCreateAgent = function(req, res) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/admin/create');
  }

  AdminRepo.createAgent({
    email: req.body.email,
    password: req.body.password,
    profile: {},
    token: {},
    RoleId: 2
  }).then(function(agent) {

    emailService.sendAgentCreationNotificationEmail(agent.email, function(err, data) {
      req.flash('success', {msg: 'Agent account created'});
      res.redirect('/admin');
    })


  }).catch(function(err) {
      req.flash('errors', { msg: err });
      return res.redirect('/agent/admin');
  })
}

exports.getDashboard = function(req, res) {
  var agentList = null;
  AdminRepo.getAgents(req.user.id)
  .then(function(list) {

    agentList = list;
    res.render('admin/dashboard', {title: 'Admin Dashboard', agentList: agentList})
  
  })
  .catch(function(err) {

    req.flash('errors', {msg: err});
    res.render('admin/dashboard', {title: 'Admin Dashboard', agentList: agentList})
  
  })
  
}

exports.getAgentSales = function(req, res) {
  AdminRepo.getAgentSales(req.params.agentId)
  .then(function(salesList) {

    res.render('admin/agentsales', {sales: salesList.list, agent: salesList.agent, title: 'Agent Sale'});

  })
  .catch(function(err) {

    req.flash('errors', {msg: err});
    res.redirect('admin');

  })
}

exports.getOrderItems = function(req, res) {
  AdminRepo.getOrderItems(req.params.orderId)
  .then(function(itemList) {

    res.render('admin/orderitems', {items: itemList, title: 'Order Items'});

  })
  .catch(function(err) {

    req.flash('errors', {msg: err});
    res.redirect('admin');

  })
}