/**
 * Created by hama on 2017/9/18.
 */
//路由文件
const express = require('express');
const router = express.Router();
//引入首页的处理函数
const home = require('./routes/home');
//引入问题的处理函数
const question = require('./routes/question');
//引入用户的处理函数
const user = require('./routes/user');
//引入消息的处理函数
const message = require('./routes/message');
//引入权限文件
const  auth = require('./common/auth');
//************************************首页***************************************
//首页的路由
router.get('/',home.index);
//注册页面的路由
router.get('/register',auth.userNotRequired,home.register);
//登录页面的路由
router.get('/login',auth.userNotRequired,home.login);
//注册行为
router.post('/register',auth.userNotRequired,home.postRegister);
//登录行为
router.post('/login',auth.userNotRequired,home.postLogin);
//退出行为
router.get('/logout',home.logout);

//个人设置页面的路由
/*router.get('/setting',auth.userRequired,home.setting);*/
//用户中心页面路由
router.get('/user-center',auth.userRequired,home.center)
//发起文章的页面路由
/*router.get('/create-question',auth.userRequired,home.createQuestion);*/
//**************************************问题***********************************
//发布问题的页面
router.get('/create-question',auth.userRequired,question.create);
//发布问题的行为
router.post('/question/create',auth.userRequired,question.postCreate);
//编辑问题的页面
router.get('/question/:id/edit',auth.userRequired,question.edit);
//编辑问题的行为
router.post('/question/:id/edit',auth.userRequired,question.postEdit);
//删除问题的行为
router.get('/question/:id/delete',auth.userRequired,question.delete);
//问题页面
router.get('/question/:id',question.index);

router.get('/edit',auth.userRequired,question.edits);

//****************************************用户**********************************
//个人设置页面
router.get('/setting',auth.userRequired,user.setting);
//更新头像
router.post('/updateImage',user.updateImage);
//更新个人资料
router.post('/updateUser/:id',user.updateUser);
//用户列表页面
router.get('/users',user.all);
//个人中心页面
router.get('/user/:name',user.index);
//用户发问列表
router.get('/user/:name/questions',user.questions);
//用户回复列表
router.get('/user/:name/replys',user.replys);

//**************************************消息*************************************
//通知的页面的路由
/*router.get('/zmessage',auth.userRequired,home.zmessage);*/
/*router.get('/zmessage',auth.userRequired,home.postMessage);*/
//消息列表页面
router.get('/my/messages',auth.userRequired,message.index);
//确认已读行为
router.get('/updateMessage/:id',message.updateMessage);
//确认全部已读行为
router.get('/updateAllMessage',message.updateAllMessage);
//显示已读消息的分页
router.post('/showMessagesPage/:page',message.showMessagesPage);
module.exports = router;

