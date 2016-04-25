var express = require('express');
var router = express.Router();

//var usr=require('dao/dbConnect');/*数据库连接用js*/
//var room=require('room/getRoomList');   //关于用mysql的room
var crypto = require('crypto'),//网页登录验证用 目前没用
    User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
  //  checkLogin(req, res, next);
  //if(req.cookies.islogin){
  //  req.session.islogin=req.cookies.islogin;
  //}
  //if(req.session.islogin){
  //  res.locals.islogin=req.session.islogin;
  //}
//读取数据库已新建房间
//    roomClient=room.connect(); //关于用mysql的room
//    room.showFun(roomClient,function (result){ //关于用mysql的room
//
//         //调用数据库方法，获取数据
//          //赋值，传到前台
////console.log(JSON.stringify(result))
////  res.render('first', { roomList: JSON.stringify(result),  title: 'Home', user: res.locals.islogin ,group:res });
//
//    }); //关于用mysql的room

    var Room = global.dbHandel.getModel('room');
    Room.find({},function(err,doc){
        console.log("find room")
        var docString=JSON.stringify(doc);
        console.log(docString);
        console.log(req.session.user);
        res.render('index',{roomList:docString});
    });
    Room.create({                             // 创建一组room对象置入model
        roomId:114,
        roomCreater:"114",
        roomName: "room114",
        roomPassword: 114
    });




});
router.get('/first', function(req, res) {

    res.render('first',{});
});
//router.get('/login', function(req, res, next) {
//
//  res.render('login', { title: 'login' });
//
//});
//router.get('/register', function (req, res) {
//    res.render('register', {
//        title: '注册',
//        user: req.session.user,
//        success: req.flash('success').toString(),
//        error: req.flash('error').toString()
//    });
//});
//router.route('/login')
//    .get(function(req, res) {
//      if(req.session.islogin){
//        res.locals.islogin=req.session.islogin;
//        res.redirect('/home');
//        //console.log(res.locals.islogin)
//
//      }
//
//      if(req.cookies.islogin){
//        req.session.islogin=req.cookies.islogin;
//      }
//      res.render('login', { title: '用户登录' });
//
//    })
//    .post(function(req, res) {
//      client=usr.connect();
//      //console.log(client)
//      var user = {
//        username: 'admin',
//        password: '123456'
//      };
//      usr.selectFun(client,req.body.username, function (result) {
//
//                 if(result[0]===undefined){
//                        res.send('没有该用户');
//                     }else{
//                        if(result[0].password===req.body.password){
//
//                              req.session.islogin=req.body.username;
//                              res.locals.islogin=req.session.islogin;
//                              res.cookie('islogin',res.locals.islogin,{maxAge:60000});
//                              res.redirect('/home');
//                          }else
//                           {
//                              res.redirect('/login');
//                            }
//                        }
//                });
//
//    });

router.route("/login").get(function(req,res){    // 到达此路径则渲染login文件，并传出title值供 login.html使用
    res.render("login",{title:'User Login'});
}).post(function(req,res){                        // 从此路径检测到post方式则进行post数据的处理操作
    //get User info
    //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    var User = global.dbHandel.getModel('user');
    var uname = req.body.uname;                //获取post上来的 data数据中 uname的值
    console.log(uname);
    User.findOne({name:uname},function(err,doc){   //通过此model以用户名的条件 查询数据库中的匹配信息
        if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
            res.send(500);
            console.log(err);
        }else if(!doc){                                 //查询不到用户名匹配信息，则用户名不存在
            req.session.error = '用户名不存在';
            console.log('用户名不存在');
            res.send(404);                            //    状态码返回404
            //    res.redirect("/login");
        }else{
            if(req.body.upwd != doc.password){     //查询到匹配用户名的信息，但相应的password属性不匹配
                req.session.error = "密码错误";
                console.log("密码错误");

                res.send(404);
                    //res.redirect("/login");
            }else{                                     //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
                req.session.user = doc;
                res.send(200);
                    //res.redirect("/home");
            }
        }
    });
});

/* GET register page. */
router.route("/register").get(function(req,res){    // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render("register",{title:'User register'});
}).post(function(req,res){
    //这里的User就是从model中获取user对象，通过global.dbHandel全局方法（这个方法在app.js中已经实现)
    var User = global.dbHandel.getModel('user');

    var uname = req.body.uname;
    var upwd = req.body.upwd;
    User.findOne({name: uname},function(err,doc){   // 同理 /login 路径的处理方式
        if(err){
            res.send(500);
            req.session.error =  '网络异常错误！';
            console.log(err);
        }else if(doc){
            console.log( '用户名已存在！');
            req.session.error = '用户名已存在！';
            res.send(500);
        }else{
            //User.create({                             // 创建一组user对象置入model
            //    name: uname,
            //    password: upwd,
            //    friends:[{
            //        group:"第一组"
            //    }]
            User.create({                             // 创建一组user对象置入model
                name: uname,
                password: upwd,
                Flist:[]
            },function(err,doc){
                if (err) {
                    res.send(500);
                    console.log(err);
                } else {
                    req.session.error = '用户名创建成功！';
                    res.send(200);
                    console.log( '用户名创建成功！');
                }
            });
        }
    });
});
//
//////**//
//router.get('/', function (req, res) {
//        res.render('index', {
//            title: '主页',
//            user: req.session.user,
//            success: req.flash('success').toString(),
//            error: req.flash('error').toString()
//        });
//    });
//
//router.get('/register', checkNotLogin);
//router.get('/register', function (req, res) {
//        res.render('register', {
//            title: '注册',
//            user: req.session.user,
//            success: req.flash('success').toString(),
//            error: req.flash('error').toString()
//        });
//    });
//
//router.post('/register', checkNotLogin);
//router.post('/register', function (req, res) {
//        var name = req.body.name,
//            password = req.body.password,
//            password_re = req.body.password1;
//        if (password_re != password) {
//            req.flash('error', '两次输入的密码不一致!');
//            return res.redirect('/register');
//        }
//        var md5 = crypto.createHash('md5'),
//            password = md5.update(req.body.password).digest('hex');
//        var newUser = new User({
//            name: name,
//            password: password,
//            email: req.body.email
//        });
//        User.get(newUser.name, function (err, user) {
//            if (err) {
//                req.flash('error', err);
//                return res.redirect('/');
//            }
//            if (user) {
//                req.flash('error', '用户已存在!');
//                return res.redirect('/register');
//            }
//            newUser.save(function (err, user) {
//                if (err) {
//                    req.flash('error', err);
//                    return res.redirect('/register');
//                }
//                req.session.user = user;
//                req.flash('success', '注册成功!');
//                res.redirect('/');
//            });
//        });
//    });
//
//router.get('/login', checkNotLogin);
//router.get('/login', function (req, res) {
//        res.render('login', {
//            title: '登录',
//            user: req.session.user,
//            success: req.flash('success').toString(),
//            error: req.flash('error').toString()
//        });
//    });
//
//router.post('/login', checkNotLogin);
//router.post('/login', function (req, res) {
//        var md5 = crypto.createHash('md5'),
//            password = md5.update(req.body.password).digest('hex');
//        User.get(req.body.name, function (err, user) {
//            if (!user) {
//                req.flash('error', '用户不存在!');
//                return res.redirect('/login');
//            }
//            if (user.password != password) {
//                req.flash('error', '密码错误!');
//                return res.redirect('/login');
//            }
//            req.session.user = user;
//            req.flash('success', '登陆成功!');
//            res.redirect('/');
//        });
//    });
//
//router.get('/post', checkLogin);
//router.get('/post', function (req, res) {
//        res.render('post', {
//            title: '发表',
//            user: req.session.user,
//            success: req.flash('success').toString(),
//            error: req.flash('error').toString()
//        });
//    });
//
//router.post('/post', checkLogin);
//router.post('/post', function (req, res) {
//    });

router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {
        req.session.user = null;
    req.session.error=null;
        //req.flash('success', '登出成功!');
        res.redirect('/');
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            //req.flash('error', '未登录!');
            res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');
        }
        next();
    }
//**////


router.get('/home', function(req, res) {
  if(req.session.islogin){
    res.locals.islogin=req.session.islogin;
  }
  if(req.cookies.islogin){
    req.session.islogin=req.cookies.islogin;
  }
    res.redirect('/');

});
router.route('/space').get(function(req, res) {//个人空间
    var User = global.dbHandel.getModel('user');
    //var uname = req.query.name;
    var uname = req.session.user.name;
    //console.log(uname)
    var friendInfo;
    User.findOne({name: uname}).populate("Flist","name").exec(function(err,doc){
        console.log("find space information")
        var persInfo=JSON.stringify(doc.Flist);
        console.log(persInfo);
        res.render('space',{persInfo:persInfo});
    });


}).post(function(req,res){
    console.log("space post")

    var User = global.dbHandel.getModel('user');
    var uname = req.session.user.name;
    var groupname=req.body.gname;
    var friendname=req.body.fname;
    console.log(friendname)
    User.findOne({name: friendname},"_id",function(err,doc){   //通过此model以用户名的条件 查询数据库中的匹配信息
        if(err){//错误就返回给原post处（login.html) 状态码为500的错误
            res.send(500);
            console.log(err);
        }else if(!doc){                                 //查询不到用户名匹配信息，则用户名不存在
            req.session.error = '好友用户名不存在';
            console.log('好友用户名不存在');
            res.send(404);                            //    状态码返回404
            //    res.redirect("/login");
        }else{

                console.log(doc);
            var Fid=doc;
                console.log("and then");
            //User.update({name: uname},{"$push":{friends:{group:groupname,list:""}}})
            //console.log( User.aggregate().unwind('freinds').match({group:'groupname'}))

            var userQuery = User.update({name:uname},{"$addToSet":{"Flist":Fid}},function(err,doc){
                //console.log(User+uname+doc.friends+"document")
            })

            //var Friends = global.dbHandel.getModel('friends');
            //console.log("this")
            //console.log(userQuery.model==User)//这里是true
            //console.log(userQuery.find==User.find)
            //console.log("and")
            ////console.log(User.find)
            //console.log(userQuery.exec(function(err,doc){
            //    console.log("the doc is")
            //    console.log(doc)
            //}))
            //userQuery.friends[0].push()
            //console.log(userQuery.select('name'))
            //userQuery.select('friends').exec({group:123})
            //userQuery.select('friends').find({'group':'第一组'},function(err,doc){
            //    console.log("here"+doc)
            //})
            //userQuery.findOne({group:'第一组'},'_id',function(err,doc){
            //    //console.log(doc)
            //});
                //doc.friends.find({group:groupname},function(err,doc){
                    //doc.list.push({Fid:Fid});
                //})

                //res.sendStatus(200);
            res.send(friendname);
                //res.redirect("/home");

        }
    });

    //console.log("the gname and fname"+uname+" "+groupname+" "+friendname);
});

router.route('/enter')
.post(function(req, res) {
    res.redirect('/room');
});



router.get('/index', function(req, res) {

    res.render('index', { title: 'Home', user: res.locals.islogin ,group:res});
});


router.get('/room/:roomid', function(req, res, next) {
    var userCookies=req.cookies.islogin
    console.log(res.locals)
    res.render('room', { roomid: req.params.roomid,userCookies:userCookies,group:res});

});


module.exports = router;
