'use strict';

var passport = require('passport');
var Promise = require('bluebird');
var LocalStrategy = require('passport-local').Strategy;

var secrets = require('./secrets');
var db = require('../models/sequelize');

passport.serializeUser(function(admin, done) {
  done(null, admin.id);
});

passport.deserializeUser(function(id, done) {
  db.Admin.findById(id).then(function(admin) {
    done(null, admin);
  }).catch(function(error) {
    done(error);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  email = email.toLowerCase();
  db.Admin.findAdmin(email, password, function(err, admin) {
    if(err)
      return done(err, null);
    return done(null, admin);
  });
}));



/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
  console.log("autign");
  console.log(req.admin);
  console.log(req.user);
  if (req.isAuthenticated()) return next();
  console.log(req.admin);
  res.redirect('/admin/login');
};

// /**
//  * Authorization Required middleware.
//  */
// exports.isAuthorized = function(req, res, next) {
//   var provider = req.path.split('/').slice(-1)[0];

//   if (req.agent.tokens[provider]) {
//     next();
//   } else {
//     res.redirect('/auth/' + provider);
//   }
// };