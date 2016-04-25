var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');//post 参数提交模块

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//
////引入mongoose模块
//var mongoose = require('mongoose');
////引入自定义的数据库配置模块
var config = require('./config');
////创建数据库连接,参数是从config配置文件的json对象中获取的连接信息,即mongodb://localhost/TaskManager
//var db=mongoose.connect(config.db.mongodb);
//db.connection.on("error", function (error) {
//  console.log("数据库连接失败：" + error);
//});
//db.connection.on("open", function () {
//  console.log("------数据库连接成功！------");
//  console.log(db.connection);
//});
//转移到了model文件夹db.js
var flash = require('connect-flash');
var multer = require('multer');

app.use(session({
  secret: config.cookieSecret,
  key: config.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    //db: config.db,
    //host: config.host,
    //port: config.port
    url: config.db.mongodb
  }),
  //不加则express-session启动警告deprecated undefined resave option
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//app.set('view engine', 'ejs');//使用ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');//使用html作为ejs

app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(multer());
app.use(cookieParser());

//
//app.use(function(req,res,next){
//  console.log('111');
//  next();
//  console.log('222');
//});
//
//app.use(function(req,res,next){
//  res.writeHead(200, { 'Content-type': 'text/html'});
//  res.write('what hasdfsdf');
//  console.log("333");
//  next();
//});
//

////session配置 /*使用的是mysql的时候*/
////需要修改的
//app.use(cookieParser("An"));
// //需要添加的
//app.use(session({
//    secret:'an',
//    resave:false,
//    saveUninitialized:true
//}));

app.use(express.static(path.join(__dirname, 'public')));//给link之类的添加了默认路径？？

app.use(function(req, res, next) {//这个一定要放在路由的前面！！！非常重要
  res.locals.user = req.session.user;
  console.log(res.locals.user)
  var err = req.session.error;
  delete req.session.error;
  res.locals.message="";
  if (err) {
    res.locals.message = '<div class="alert alert-warning">' + err + '</div>';
  }
  next();
});



app.use('/', routes);
app.use('/users', users);
app.use('/login', routes);
app.use('/register', routes);
app.use('/home', routes);
app.use('/enter', routes);
app.use('/index', routes);
app.use('/space', routes);

app.use('/room', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') { // 开发环境中，将错误信息直接渲染error模板并显示到浏览器
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
app.use(function(err, req, res, next) {// 生产环境下，将错误信息选人成Error模板显示
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });

});


module.exports = app;

