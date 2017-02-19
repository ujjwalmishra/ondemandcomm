'use strict';

var passport = require('../config/passport_agent').passport;
var AgentRepo = require('../repositories/AgentRepository.js');

exports.getLogin = function(req, res) {
  if (req.user && req.user.RoleId == 2)
    return res.redirect('/agent/agent');
  if(req.user && req.user.RoleId == 1) 
    return res.redirect('/agent/admin');

  res.render('agent/login', {
    title: 'Login Agent'
  });
};

exports.postLogin = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/agent/login');
  }

  passport.authenticate('local', function(err, agent, info) {

    if (!agent || err) {
      req.flash('errors', { msg: err || info.message });
      return res.redirect('/agent/login');
    }
    req.logIn(agent, function(loginErr) {
      if (loginErr) return next(loginErr);
      req.flash('success', { msg: 'Success! You are logged in.' });
      var redirectTo = '/';
      if(agent.RoleId == 1) {
        redirectTo = '/agent/admin';
      }
      else {
        redirectTo = '/agent/agent';
      }
      res.redirect(redirectTo);
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.logOut();
  res.locals.user = null;
  res.render('home', {
    title: 'Home',
    isAgent: false
  });
};

//Default agent screen to initiate chat
exports.getDashboard = function(req, res) {
  if(req.user.RoleId == 1) {
    return res.redirect('admin');
  }
  res.render('agent/dashboard', {
    title: 'Dashboard'
  });	
}


exports.getAccount = function(req, res) {
  res.render('agent/profile', {
    title: 'Agent Account Management'
  });
};

exports.postUpdateProfile = function(req, res) {
  req.assert('email', 'Email is not valid').isEmail();

  AgentRepo.changeProfileData(req.user.id, req.body)
    .then(function() {
      req.flash('success', { msg: 'Profile information updated.' });
      res.redirect('account');
    })
    .catch(function(err) {
      console.log(err);
      req.flash('errors', { msg: err });
      res.redirect('account');
    });
};
