var createError = require('http-errors');
var express = require('express');
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// config variables
const config = require('./config/config.js');

// environment variables
process.env.NODE_ENV = 'development';
process.env.PORT = global.gConfig.port;

const adminRouter = require('./routes/admin/index');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs(
  {
      defaultLayout: "main",
      runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true,
      },
      layoutsDir:'views/layouts',
  }
));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/users', usersRouter);

//admin route
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
