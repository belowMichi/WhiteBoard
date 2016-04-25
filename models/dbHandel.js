/**
 * Created by Administrator on 2016-03-26 .
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require("./models");

for(var m in models){
    mongoose.model(m,new Schema(models[m]));
}

//m目前只有一个user

module.exports = {
    getModel: function(type){
        return _getModel(type);
    }
};

var _getModel = function(type){
    return mongoose.model(type);
};