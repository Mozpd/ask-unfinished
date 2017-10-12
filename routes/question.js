/**
 * Created by hama on 2017/9/18.
 */
const  mapping = require('../static');
const setting = require('../setting');
const validator = require('validator');
//引入问题表
const Question = require('../model/Question');
//引入用户表
const  User  = require('../model/User');
//引入at模块
const  at  = require('../common/at')
//新建问题的处理函数
exports.create = (req,res,next)=>{
    res.render('create-question',{
        title:'发布文章页面',
        layout:'indexTemplate',
        resource:mapping.create,
        categorys:setting.categorys,
    })
}
//新建行为的处理函数
exports.postCreate = (req,res,next)=>{
    console.log(1)

    let title = validator.trim(req.body.title);
    console.log(2)
    let  category = validator.trim(req.body.category);
    let content  = validator.trim(req.body.content);
    let error;

    if(!validator.isLength(title,{min:8,max:20})){
        error = '问题内容不合法 请重新输入'
    }
    if (!validator.isLength(content,{min:8})){
        error = '问题内容不合法 请重新输入'
    }
    if (error){
        return res.end(error);
    }else {

        //验证成功后

        req.body.author = req.session.user._id;
        let newQuestion = new Question(req.body);
        newQuestion.save().then(question=>{
                //某个人发布一篇文章 其积分+5，发布数量+1
            User.getUserById(req.session.user._id,(err,user)=>{
                if(err){
                    return res.end(err);
                }
                user.sore += 5;
                user.article_count += 1;
                user.save();
                req.session.user = user;//跟新session的内容
                res.json({url:`/question/${question._id}`})//返回的是一个添加问题的页面地址
            })
            //发送at消息
            at.sendMessageToMentionUsers(content,question._id,req.session.user._id,(err,msg)=>{
                console.log(msg)
            });
        }).catch(err=>{
            return res.end(err);
        })
    }
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
    //问题的ID
    let question_id = req.params.id;
    //当前登录的用户
    let currentUser = req.session.user;
    //1.问题的信息
    //2.问题的回复信息
    //3.问题作者的其他相关文章推荐
    Question.getFullQuestion(question_id,(err,question)=>{
        if(err){
            return res.end(err);
        }
        if(question == null){
            return res.render('error',{
                title:'错误页面',
                resource:mapping.userSetting,
                layout:'indexTemplate',
                message:'该问题不存在或者已经被删除',
                error:''
            })
        }
        //给问题的内容如果有@用户 ，给@用户添加一个链接
        question.content = at.linkUser(question.content);
        //问题的访问量+1
        question.click_num += 1;
        question.save();
        console.log(question.author._id);
        Question.getOtherQuestions(question.author._id,question._id,(err,questions)=>{
            return res.render('question',{
                title:'问题详情页面',
                layout:'indexTemplate',
                question:question,
                others:questions,
                resource:mapping.question,
            })
        })

    });

}
