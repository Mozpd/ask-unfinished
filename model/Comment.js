/**
 * Created by hama on 2017/9/18.
 */
//二级回复表
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BaseModel = require('./base_model');
const CommentSchema = new Schema({

});
//当前的模型就会有BaseModel 里面的方法了
CommentSchema.plugin(BaseModel);
const Comment = mongoose.model('Comment',CommentSchema);
module.exports = Comment
