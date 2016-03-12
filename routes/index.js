var express = require('express');
var router = express.Router();

var usr=require('dao/dbConnect');/*数据库连接用js*/
var room=require('room/getRoomList');
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });

  if(req.cookies.islogin){
    req.session.islogin=req.cookies.islogin;
  }
  if(req.session.islogin){
    res.locals.islogin=req.session.islogin;
  }
//读取数据库已新建房间
    roomClient=room.connect();
    room.showFun(roomClient,function (result){

         //调用数据库方法，获取数据
          //赋值，传到前台
console.log(JSON.stringify(result))
  res.render('first', { roomList: JSON.stringify(result),  title: 'Home', user: res.locals.islogin ,group:res });
    });
});

//router.get('/login', function(req, res, next) {
//
//  res.render('login', { title: 'login' });
//
//});

router.route('/login')
    .get(function(req, res) {
      if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
        res.redirect('/home');
        //console.log(res.locals.islogin)

      }

      if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
      }
      res.render('login', { title: '用户登录' });

    })
    .post(function(req, res) {
      client=usr.connect();
      //console.log(client)
      var user = {
        username: 'admin',
        password: '123456'
      };
      usr.selectFun(client,req.body.username, function (result) {

                 if(result[0]===undefined){
                        res.send('没有该用户');
                     }else{
                        if(result[0].password===req.body.password){

                              req.session.islogin=req.body.username;
                              res.locals.islogin=req.session.islogin;
                              res.cookie('islogin',res.locals.islogin,{maxAge:60000});
                              res.redirect('/home');
                          }else
                           {
                              res.redirect('/login');
                            }
                        }
                });

    });



router.get('/home', function(req, res) {
  if(req.session.islogin){
    res.locals.islogin=req.session.islogin;
  }
  if(req.cookies.islogin){
    req.session.islogin=req.cookies.islogin;
  }
    res.redirect('/');

});

router.route('/enter')
.post(function(req, res) {
    res.redirect('/room');
});



router.get('/index', function(req, res) {

    res.render('index', { title: 'Home', user: res.locals.islogin ,group:res});
});


router.get('/room/:roomid', function(req, res, next) {


    res.render('room', { roomid: req.params.roomid, user: res.locals.islogin ,group:res});

});


module.exports = router;
