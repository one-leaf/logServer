var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var routes = require('./routes/index');
var appRoutes = require('./routes/app');
var apiRoutes = require('./routes/api');
var aboutRoutes = require('./routes/about');
var mkdirp = require('mkdirp');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes(app));
app.use('/api', apiRoutes(app));
app.use('/app', appRoutes(app));
app.use('/about',aboutRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var configs = {};

try {
  configs = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json'), 'utf8'));
} catch(ex) {
  console.log(ex.stack);
}

var logPath=path.join(__dirname, configs.logPath||'logs');
mkdirp(logPath);

app.set('port',configs.port);
app.set('logPath',logPath);

module.exports = app;
