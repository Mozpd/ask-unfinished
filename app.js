//ES6中声明常量使用const关键字.
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//引入expressPartials第三方插件
const partials= require('express-partials');
//引入第三方session插件
const session = require('express-session');
//引入路由规则的文件
const routes = require('./routes');
//引入setting配置文件
const setting = require('./setting');
//引入权限文件
const auth = require('./common/auth');
//引入lodash工具类
const _ = require('lodash');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(setting.cookie_secret));
//使用session
app.use(session({
    secret:setting.cookie_secret, //是给session加密的.通常应该是session存储的时候进行加密
    resave:true,
    saveUninitialized:true
}));
//通过cookie去生成session的方法
app.use(auth.authUser);
//将session信息保存在本地
app.use((req,res,next)=>{
    //将用户的登录信息保存在本地
    res.locals.user = req.session.user;
    //将用户的消息数量保存在本地
    res.locals.msg_count = req.session.msg_count;
    next();
})
app.use(express.static(path.join(__dirname, 'public')));
//使用模板的第三方插件
app.use(partials())

app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

_.extend(app.locals,require('./common/markdown'));
app.listen(5000,()=>{
  console.log('node is OK');
})
module.exports = app;
