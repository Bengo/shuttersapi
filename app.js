var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var infosRouter = require('./routes/infos');
var shuttersRouter = require('./routes/shutters');
var modeRouter = require('./routes/mode');

var bodyParser = require('body-parser');
var periodicRules = require('./modules/periodicrules');

var app = express();
app.set('port', process.env.SHUTTERS_API_PORT || 3000);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/infos', infosRouter);
app.use('/shutters', shuttersRouter);
app.use('/mode', modeRouter);

periodicRules.start();

module.exports = app;
