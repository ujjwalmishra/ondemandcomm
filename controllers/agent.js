'use strict';

var passport = require('../config/passport_agent').passport;

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
    console.log('agent in agent');
    console.log(err);
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
      // console.log("redirectuing");
      // var redirectTo = req.session.returnTo || '/';      
      // console.log(redirectTo);
      // delete req.session.returnTo;
      res.redirect(redirectTo);
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  console.log("logniout");
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
