'use strict';

var crypto;
var async = require('neo-async');
var passport = require('../config/passport_agent').passport;

var AdminRepo = require('../repositories/AdminRepository.js');
var emailService = require('../services/emailService.js');


// exports.getLogin = function(req, res) {
//   if (req.agent)
//     return res.redirect('/admin');

//   res.render('admin/login', {
//     title: 'Login Admin'
//   });
// };

// exports.postLogin = function(req, res, next) {
//   req.assert('email', 'Email is not valid').isEmail();
//   req.assert('password', 'Password cannot be blank').notEmpty();

//   var errors = req.validationErrors();

//   if (errors) {
//     req.flash('errors', errors);
//     return res.redirect('/admin/login');
//   }

//   passport.authenticate('local', function(err, admin, info) {
//     console.log("pasauth");
//     if (!admin || err) {
//       req.flash('errors', { msg: err || info.message });
//       return res.redirect('/login');
//     }
//     req.logIn(admin, function(loginErr) {
//       if (loginErr) return next(loginErr);
//       req.flash('success', { msg: 'Success! You are logged in.' });
//       var redirectTo = req.session.returnTo || '/';
//       console.log("redirectinf");
//       console.log(redirectTo);
//       delete req.session.returnTo;
//       res.redirect(redirectTo);
//     });
//   })(req, res, next);
// };

// exports.logout = function(req, res) {
//   req.logout();
//   res.locals.admin = null;
//   res.render('home', {
//     title: 'Home'
//   });
// };

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
      console.log("mailer result");
      console.log(err);
      console.log(data);
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