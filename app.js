var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/admin/users');
var votingRouter = require('./routes/client/voting');
var suaraRouter = require('./routes/suara');
var histRouter = require('./routes/history');
var adminRouter = require('./routes/admin/index');
var adminEventRouter = require('./routes/admin/events');
var adminCalonRouter = require('./routes/admin/calon');
var adminHistoryRouter = require('./routes/admin/history');
var clientRouter = require('./routes/client/index');
var clientHistRouter = require('./routes/client/events');
var voteRouter = require('./routes/client/vote');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin/users', usersRouter);
app.use('/dashboard/voting', votingRouter);
app.use('/suara', suaraRouter);
app.use('/history', histRouter);
app.use('/admin/', adminRouter);
app.use('/admin/events', adminEventRouter);
app.use('/admin/calon', adminCalonRouter);
app.use('/admin/history', adminHistoryRouter);
app.use('/dashboard/', clientRouter);
app.use('/dashboard/events', clientHistRouter);
app.use('/dashboard/vote', voteRouter);

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
