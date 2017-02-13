'use strict';

var passport = require('passport');
var Promise = require('bluebird');
var LocalStrategy = require('passport-local').Strategy;

var secrets = require('./secrets');
var db = require('../models/sequelize');

passport.serializeUser(function(agent, done) {
  done(null, agent.id);
});

passport.deserializeUser(function(id, done) {
  db.Agent.findById(id).then(function(agent) {
    done(null, agent);
  }).catch(function(error) {
    done(error);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  email = email.toLowerCase();
  db.Agent.findAgent(email, password, function(err, agent) {
    if(err)
      return done(err, null);
    return done(null, agent);
  });
}));



/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/agent/login');
};

/**
 * Authorization Required middleware.
 */
// exports.isAuthorized = function(req, res, next) {
//   var provider = req.path.split('/').slice(-1)[0];

//   if (req.agent.tokens[provider]) {
//     next();
//   } else {
//     res.redirect('/auth/' + provider);
//   }
// };