var express = require('express');
var cors = require('cors')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var utils = require('./app/utils/crypto')
var app = express();

app.use(cors())
app.use('/api/*', function (req, res, next) {
  var freeAuthPath = [
    '/api/owners/login',
    '/api/owners/registerOwner',
    '/api/users/registerUser',
    '/api/users/login',
    '/api/owners/getOwners',
    '/api/users/getUsers',
    '/api/users/delUser',
    '/api/users/getUserById',
    '/api/users/editUser'
  ];
  var available = false;
  for (var i = 0; i < freeAuthPath.length; i++) {
    if (freeAuthPath[i] == req.baseUrl) {
      available = true;
      break;
    }
  }
  if (!available) {
    utils.ensureAuthorized(req, res, next);
  } else {
    next();
  }
});


// rootRequired function
global.__rootRequire = function (relpath) {
  return require(path.join(__dirname, relpath));
};

global.__rootPath = function (relpath) {
  return path.join(__dirname, relpath);
};

global.__res = require('./app/utils/responce');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', index);
app.use('/api', require('./app/api/v1/routes')(express));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers development error handler will print stacktrace
if (app.get('env') === 'development') {
  app
    .use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
}

// production error handler no stacktraces leaked to user
app
  .use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

module.exports = app;