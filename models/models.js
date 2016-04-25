/**
 * Created by Administrator on 2016-03-26 .
 */
var mongoose = require('mongoose');
module.exports = {
    user:{
        name:{type:String,required:true},
        password:{type:String,required:true},
        nick:{type:String,required:false},//nick name可以为空
        //friends: [{
        //    group: {type:String,required:true},
        Flist: [{type:mongoose.Schema.Types.ObjectId,ref:"user"}]
        //}
        //]
        //friends:[{
        //    type:mongoose.Schema.Types.ObjectId,//对应"friends"的schema 的_id
        //    ref:"friends"  //对应"friends"的schema 的名称
        //}]
    },
    room:{
        roomCreater:{type:String,required:true},//房主名
        roomName:{type:String,required:true},//房间名
        roomPassword:String//房间密码
    }

};
