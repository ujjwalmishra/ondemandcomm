var express = require('express');
var app = express();
var router = express.Router();
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var lusca = require('lusca');
var flash = require('express-flash');
var path = require('path');
var multer = require('multer');
var mime = require('mime');

var passportAgentConf = require('../config/passport_agent');
var secrets = require('../config/secrets');


var agentController = require('../controllers/agent');
var adminController = require('../controllers/admin');
var productController = require('../controllers/product');


app.use(router);

app.use(session({
  name: 'admin.sid',	
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

app.use(flash());

app.use(passportAgentConf.passport.initialize());
app.use(passportAgentConf.passport.session());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  if(req.user) {
    res.locals.isAgent = true;    
  }
  else{
    res.locals.isAgent = false;  
  }

  next();
});

app.use(function(req, res, next) {
   if (req.path === '/product/create') {
     res.locals._csrf = 'wololo';
     next();
  } else {
    lusca.csrf()(req, res, next);
  }
 });

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join( __dirname,'../', 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, '' + Date.now() + '-' + file.fieldname + '.' + mime.extension(file.mimetype))
  }
})
 
var upload = multer({ storage: storage });

app.use(function(req, res, next) {
  res.cookie('XSRF-TOKENA', res.locals._csrf, {httpOnly: false});
  next();
});

/**
 * Agent routes.
 */
app.get('/', passportAgentConf.isAuthenticated, agentController.getDashboard); 
app.get('/agent', passportAgentConf.isAuthenticated, agentController.getDashboard);
app.get('/login', agentController.getLogin);
app.get('/account', agentController.getAccount);
app.post('/account', agentController.postUpdateProfile);
app.post('/login', agentController.postLogin);
app.get('/logout', agentController.logout);
app.get('/product/create', productController.getCreateProduct);
app.post('/product/create', upload.single('productimage'), productController.postCreateProduct);
app.get('/products', productController.getProductsList);

/**
 * Admin routes.
 */
app.get('/admin', passportAgentConf.isAuthenticated, adminController.getDashboard);
app.get('/admin/agent/:agentId', adminController.getAgentSales);
app.get('/admin/order/:orderId', adminController.getOrderItems);
app.get('/admin/create', adminController.getCreateAgent);
app.post('/admin/create', adminController.postCreateAgent);


module.exports = app;