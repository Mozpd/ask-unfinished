/**
 * Created by hama on 2017/9/18.
 */
const  mapping = require('../static');
//新建问题的处理函数
exports.create = (req,res,next)=>{

}
//新建行为的处理函数
exports.postCreate = (req,res,next)=>{

}
//编辑问题的处理函数
exports.edit = (req,res,next)=>{

}
exports.edits = (req,res,next)=>{
    res.render('edit',{
        title:'编辑页面',
        layout:'indexTemplate',
        resource:mapping.edit,
    })
}
//编辑行为的处理函数
exports.postEdit = (req,res,next)=>{

}
//删除行为的处理函数
exports.delete = (req,res,next)=>{

}
//查询问题的处理函数
exports.index = (req,res,next)=>{
    res.render('question',{
        title:'问题页面',
        layout:'indexTemplate',
        resource:mapping.question,
    })
}
