var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//app.set('view engine', 'ejs');//使用ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');//使用html作为ejs


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

//session配置
//需要修改的
app.use(cookieParser("An"));
 //需要添加的
app.use(session({
    secret:'an',
    resave:false,
    saveUninitialized:true
}));


app.use(express.static(path.join(__dirname, 'public')));//给link之类的添加了默认路径？？
app.use('/', routes);
app.use('/users', users);
app.use('/login', routes);
app.use('/home', routes);
app.use('/enter', routes);
app.use('/index', routes);

app.use('/room', routes);

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = '';
  if (err) {
    res.locals.message = '<div class="alert alert-warning">' + err + '</div>';
  }
  next();
});

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

//

//
//var server = require('http').Server(app);
//var io = require('socket.io')(server);
//
//
//server.listen(80);
//
//app.get('/', function (req, res) {
//  res.sendfile(__dirname + '/index.html');
//});
//
//io.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//});