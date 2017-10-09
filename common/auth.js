const  setting = require('../setting');
const  User    = require('../model/User');
const Message = require('../model/Message');
const  auth = {
    gen_session:(user,res)=>{
        let auth_user  = `${user._id}$$$$`;
        res.cookie(setting.auth_name,auth_user,{
            path:'/',
            signed:true, //对cookie密码进行加密的话 需要使用cookieParser
            httpOnly:true,
            maxAge:30*24*60*60*1000
        })
    },
    authUser:(req,res,next)=>{
        //中间件，所有的请求都要经过它 我们在这来判断用户的登录情况
        if (req.session.user){
            //添加用户的信息数量
            Message.getMessagesCount(req.session.user._id,(err,count)=>{
                req.session.msg_count = count;
                next();//用户已经登录情况下 直接下一步
            })

        }else {
            //需要通过cookie去生成session
            //1,获取cookie
            let auth_token = req .signedCookies[setting.auth_name];//cookiepaser通过signedCookies直接帮我解密
            if (!auth_token){
                next();//用户没有cookie的情况
            }else {
                //2,通过cookie生成session
                let auth = auth_token.split('$$$$');
                let user_id = auth[0];
                //数据库中去找这个用户的id
                User.findOne({_id:user_id},(err,user)=>{
                    if (err){
                      return  res.end(err);
                    }
                    if (!user){
                        next();
                    }else {
                        //3，结束
                        //查询出用户的信息数量
                        Message.getMessagesCount(user_id,(err,count)=>{
                            req.session.msg_count = count;
                            req.session.user = user;
                            /*console.log(req.session.user)*/
                            next()
                        })

                    }
                })
            }


        }
    },
    //判断用户未登录的中间件
    userRequired:(req,res,next)=>{
        if (!req.session || !req.session.user || !req.session.user._id){
            res.status(403).send('没有权限！');
        }
        next();
    },
    //判断用户已登录的中间件
    userNotRequired:(req,res,next)=>{
        if(req.session.user != undefined){
            return res.status(403).send('已经登录了，请返回操作');
        }
        next();
    }
}
module.exports = auth