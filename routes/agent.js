var express = require('express');
var app = express();
var router = express.Router();
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);

var passportAgentConf = require('../config/passport_agent');
var secrets = require('../config/secrets');


var agentController = require('../controllers/agent');
var adminController = require('../controllers/admin');


app.use(router);

app.use(session({
  store: new pgSession({
    conString: secrets.postgrescomm,
    tableName: secrets.sessionTableAgent
  }),
  secret: secrets.sessionSecretAgent,
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true
    //, secure: true // only when on HTTPS
  }
}));

app.use(passportAgentConf.passport.initialize());
app.use(passportAgentConf.passport.session());

/**
 * Agent routes.
 */
app.get('/agent', passportAgentConf.isAuthenticated, agentController.getDashboard);
app.get('/login', agentController.getLogin);
app.post('/login', agentController.postLogin);
app.get('/logout', agentController.logout);

/**
 * Admin routes.
 */
app.get('/admin', passportAgentConf.isAuthenticated, adminController.getDashboard);
app.get('/admin/create', passportAgentConf.isAuthenticated, adminController.getCreateAgent);
app.post('/admin/create', passportAgentConf.isAuthenticated, adminController.postCreateAgent);


module.exports = app;