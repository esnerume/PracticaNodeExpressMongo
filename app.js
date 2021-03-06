'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Cargamos la librería de conexión a MongoDB (a través de Mongoose)
require('./lib/mongoConnection');

require('./models/Anuncio.js');
require('./models/Usuario.js');

var routes = require('./routes/index');
var usuarios = require('./routes/usuarios');
var i18nTranslate = require('./lib/i18n');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/usuarios', usuarios);
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));
app.use('/apiv1/tags', require('./routes/apiv1/tags'));

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
      i18nTranslate(req.headers['api-language'], err.message, function (tranlatedMessage) {
          res.json({success: false, error: tranlatedMessage});
      });

  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    i18nTranslate(req.headers['api-language'], err.message, function (tranlatedMessage) {
        res.json({success: false, error: tranlatedMessage});
    });
});


module.exports = app;
