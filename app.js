'use strict';
/**
 * Module dependencies.
 */
// var toobusy = require('toobusy-js');
var express = require('express');
require('dotenv').config();
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var logger = require('morgan');
var chalk = require('chalk');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var multer = require('multer');
var ejsEngine = require('ejs-mate');
var Promise = require('bluebird');

//var MySQLStore = require('connect-mysql')({ session: session });
var path = require('path');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

//import apps
var mainApp =  require('./routes/index');
var agentApp = require('./routes/agent');

/**
 * Create Express server.
 */
var app = express();


/* Avoid not responsing when server load is huge */
// app.use(function(req, res, next) {
//   if (toobusy()) {
//     res.status(503).send("I'm busy right now, sorry. Please try again later.");
//   } else {
//     next();
//   }
// });

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.engine('ejs', ejsEngine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable("trust proxy");
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')]
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: path.join(__dirname, 'uploads') }).single());
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());

Promise.longStackTraces();

var db = require('./models/sequelize');
var dbChat = require('./models/chat');

//MySQL Store

// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: secrets.sessionSecret,
//   store: new MySQLStore({
//     config: secrets.mysqlcomm,
//     table: secrets.sessionTable
//   })
// }));




app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


// set routes

app.use('/agent', agentApp);
app.use('/', mainApp);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */

db
  .sequelize
  .sync({ force: false })
  .then(function() {
      app.listen(app.get('port'), function() {
        console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
      });
  });

dbChat
.sequelize
.sync({force:false})
.then(function() {
  console.log("connected to chat db");
}, function(err){
  console.log(err);
})  

module.exports = app;