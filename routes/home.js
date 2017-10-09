/**
 * Created by hama on 2017/9/18.
 */
//静态资源的对象
const  mapping = require('../static');
//引入验证的资源对象
const  validator =require('validator');
//引入User表
const User =require('../model/User');
//引入数据库操作文件db.js
const  DBSet = require('../model/db');
//引入配置文件
const  setting = require('../setting');
//引入发送邮件的通用方法
const mail = require('../common/mail');
//引入权限的文件
const auth = require('../common/auth');
//首页的处理函数
exports.index = (req,res,next)=>{
    res.render('index',{
        title:'首页',
        //默认模板
        layout:'indexTemplate'
    })
}
//注册页面的处理函数
exports.register = (req,res,next)=>{
    res.render('register',{
        title:'注册页面',
        layout:'indexTemplate',
        resource:mapping.register,
    })
}
//登录页面的处理函数
exports.login = (req,res,next)=>{
    res.render('login',{
        title:'登录页面',
        layout:'indexTemplate',
        resource:mapping.login,
    })
}
/*exports .zmessage=(req,res,next)=>{
    res.render('zmessage',{
        title:'消息页面',
        layout:'indexTemplate',
        resource:mapping.message,
    })
};*/

exports.center=(req,res,next)=>{
    res.render('user-center',{
        title:'个人中心页面',
        layout:'indexTemplate',
        resource:mapping.userCenter,
    })
};
/*exports.createQuestion=(req,res,next)=>{
   /!* res.render('create-question',{
        title:'发布文章页面',
        layout:'indexTemplate',
        resource:mapping.create,
    })*!/
}*/
//注册行为的处理函数
exports.postRegister = (req,res,next)=>{
    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email;
    let error;
    //后端验证用户名
    if(!validator.matches(name,/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/,'g')){
        error = '用户名不合法,5-12位,数字字母下划线,请重新输入'
    }
    //密码
    if(!validator.matches(password,/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,}/,'g') ||
        !validator.isLength(password,6,12)){
        error = '密码不合法,长度在5-12位,请重新输入'
    }
    //邮箱验证
    if(!validator.isEmail(email)){
        error = '邮箱格式不合法,请重新输入';
    }
    if(error){
        res.end(error);//如果上述验证失败，就直接将失败的提示消息发给前端.
    }else{
        //验证成功了
        let query = User.find().or([{name:name},{email:email}]);
        query.exec().then(user=>{
            if(user.length > 0){
                //找到这个用户了，说明它以前注册过
                error = '不允许重复注册，请重新填写注册信息'
                res.end(error);
            }else{
                //没重复的情况，允许注册
                //发送邮件
                var regMsg = {name:name,email:email};
                mail.sendEmail('reg_mail',regMsg,(info)=>{
                    console.log(info);
                })
                //没重复的情况，允许注册
                let newPSD = DBSet.encrypt(password,setting.psd);
                req.body.password = newPSD;
                DBSet.addOne(User,req,res,'success');
            }
        }).catch(err=>{
            res.end(err);
        })
    }
    console.log(11)

}
//登录行为的处理函数
exports.postLogin = (req,res,next)=>{
    let name = req.body.name;
    let password =req.body.password;
    let getName ;//用户名登录
    let getUser;//方法 通过用户名和密码来获取用户的登录信息的
    let getEmail;//用邮箱登录
    let error;//错误提示
    name.includes('@')? getEmail = name : getName =name;
    //1.判断用户名是否合法
    if(getName){
        if(!validator.matches(name,/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/,'g')){
            error = '用户名不合法'
        }
    }
    console.log(3)
    //2.判断邮箱是否合法
    if (getEmail){
        if(!validator.isEmail(getEmail)){
            error = '邮箱格式不合法,请重新输入';
        }
    }
    console.log(4)
    //3.验证密码
    if(!validator.matches(password,/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,}/,'g') ||
        !validator.isLength(password,6,12)){
        error = '密码不合法,长度在5-12位,请重新输入'
    }
    console.log(5)
    //4.如果验证不成功，直接将错误提示返回 让用户重新填写内容
    if (error){
        res.end(error)
    }else{
        //验证成功
        if (getEmail){
            getUser = User.getUserByEmail
        }else {
            getUser = User.getUserByName
        }
        getUser(name,(err,user)=>{
            if (err){
             return   res.end(err);
            }
            if (!user){
              return res.end('该用户名/邮箱不存在');
            }
            //最后一步 比较密码
            let newPSD = DBSet.encrypt(password,setting.psd);
            if (user.password != newPSD){
              return  res.end('密码错误，请重新输入');
            }
            //生成cookie
            auth.gen_session(user,res);
            //正确了 直接返回一个字符串,success
            return res.end('success');
        })
    }
    console.log(6)

}

//通知消息行为
exports.postMessage= (req,res,next)=>{

}
//退出行为的处理函数
exports.logout = (req,res,next)=>{
   //清除session
    req.session.destroy()
    //cookie删除
    res.clearCookie(setting.auth_name);
    res.redirect('/')
}



