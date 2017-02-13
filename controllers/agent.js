'use strict';

var passport = require('passport');

exports.getLogin = function(req, res) {
  if (req.agent)
    return res.redirect('/agents');

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
    console.log(err);
    if (!agent || err) {
      req.flash('errors', { msg: err || info.message });
      return res.redirect('/agent/login');
    }
    req.logIn(agent, function(loginErr) {
      if (loginErr) return next(loginErr);
      req.flash('success', { msg: 'Success! You are logged in.' });
      var redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(redirectTo);
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.logout();
  res.locals.agent = null;
  res.render('home', {
    title: 'Home'
  });
};

//Default agent screen to initiate chat
exports.getDashboard = function(req, res) {
  res.render('agent/dashboard', {
    title: 'Dashboard'
  });	
}
