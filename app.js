const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const formidable = require('express-formidable');
require('dotenv').config();

const indexRouter = require('./routes/index');
const categoryRouter = require('./routes/category');
const itemRouter = require('./routes/item');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

async function startdb() {
  await mongoose.connect(process.env.MONGODB);
}

startdb().catch(err => console.log(err));

app.use(logger('dev'));

app.use(formidable({
  encoding: 'utf-8',
  uploadDir: path.join(__dirname, 'uploads'),
  multiples: false,
  keepExtensions: true
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/category', categoryRouter);
app.use('/item', itemRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
