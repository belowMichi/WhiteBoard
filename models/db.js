/**
 * Created by Administrator on 2016-03-25 .
 */



//引入mongoose模块
var mongoose = require('mongoose');
//引入自定义的数据库配置模块
var config = require('../config');
//创建数据库连接,参数是从config配置文件的json对象中获取的连接信息,即mongodb://localhost/TaskManager
global.dbHandel = require('./dbHandel');
var db=mongoose.connect(config.db.mongodb);
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");

});