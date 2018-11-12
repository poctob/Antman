var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var processRouter = require('./routes/process');
var customerRouter = require('./routes/customer');
var projectRouter = require('./routes/project');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/process', processRouter);
app.use('/api/customer', customerRouter);
app.use('/api/project', projectRouter);

module.exports = app;
