var express = require('express');
var app = express();
var router = express.Router();
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var lusca = require('lusca');
var flash = require('express-flash');

/**
 * Controllers (route handlers).
 */
var homeController = require('../controllers/home');
var userController = require('../controllers/user');
var apiController = require('../controllers/api');
var contactController = require('../controllers/contact');

/**
 * API keys and Passport configuration.
 */
var secrets = require('../config/secrets');
var passportConf = require('../config/passport');

app.use(router);

// PostgreSQL Store
app.use(session({
  name: 'sid',		
  store: new pgSession({
    conString: secrets.postgrescomm,
    tableName: secrets.sessionTable
  }),
  secret: secrets.sessionSecret,
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true
    //, secure: true // only when on HTTPS
  }
}));

app.use(flash());

app.use(passportConf.passport.initialize());
app.use(passportConf.passport.session());


app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.isAgent = false;
  next();
});

app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));


app.use(function(req, res, next) {
  console.log()
  res.cookie('XSRF-TOKEN', res.locals._csrf, {httpOnly: false});
  next();
});


app.use(function(req, res, next) {
  if (/api/i.test(req.path)) req.session.returnTo = req.path;
  next();
});

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.delete('/account', passportConf.isAuthenticated, userController.deleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

/**
 * Product routes.
 */
// app.get('/products', productController.getProducts);
// app.get('/product/:productId/edit', productController.getEdit);
// app.post('/product/:productId/edit', productController.postEdit);
// app.get('/product/:productId/detail', productController.detail);
// app.get('/product/search', productController.search);

/**
 * Orders routes.
 */
// app.get('/orders', orderController.index);
// app.get('/order/:orderId', orderController.order);
// app.post('/order', orderController.orderPost);

/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/steam', apiController.getSteam);
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTwitter);
app.post('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postTwitter);
app.get('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getVenmo);
app.post('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postVenmo);
app.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getLinkedin);
app.get('/api/yahoo', apiController.getYahoo);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/lob', apiController.getLob);
app.get('/api/bitgo', apiController.getBitGo);
app.post('/api/bitgo', apiController.postBitGo);


function safeRedirectToReturnTo(req, res) {
  var returnTo = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(returnTo);
}

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/facebook', passportConf.passport.authenticate('facebook', secrets.facebook.authOptions));
app.get('/auth/facebook/callback', passportConf.passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: true }), safeRedirectToReturnTo);
app.get('/auth/github', passportConf.passport.authenticate('github', secrets.github.authOptions));
app.get('/auth/github/callback', passportConf.passport.authenticate('github', { failureRedirect: '/login', failureFlash: true }), safeRedirectToReturnTo);
app.get('/auth/google', passportConf.passport.authenticate('google', secrets.google.authOptions));
app.get('/auth/google/callback', passportConf.passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }), safeRedirectToReturnTo);
app.get('/auth/twitter', passportConf.passport.authenticate('twitter', secrets.twitter.authOptions));
app.get('/auth/twitter/callback', passportConf.passport.authenticate('twitter', { failureRedirect: '/login', failureFlash: true }), safeRedirectToReturnTo);
app.get('/auth/linkedin', passportConf.passport.authenticate('linkedin', secrets.linkedin.authOptions));
app.get('/auth/linkedin/callback', passportConf.passport.authenticate('linkedin', { failureRedirect: '/login', failureFlash: true }), safeRedirectToReturnTo);


module.exports = app;