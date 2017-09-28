
const SETTING = require('../setting');
const nodemailer = require('nodemailer');
const mail ={
    sendEmail:(type,regMsg,callback)=>{
        //需要准备的用户名和发送的目标邮箱
        let name = regMsg.name;//要发送邮箱的用户名
        let email = regMsg.email;//要发送邮箱的地址

        //创建SMTP服务
        let transporter = nodemailer.createTransport({
            service:'163',
            auth:{
                user:'q1014557543@163.com',
                pass:'zpd1014557543'
            }
        })
        //发送的配置参数
        let mailOptions = {
            from:`${SETTING.mail_opts.auth.user}`, //发送者的邮箱
            to: `${email}`, // 接收者的邮箱
            subject: `${name}恭喜您,注册成功`, // 发送的主题
            text: `${name}你好`, // 发送的标题
            html: `<b>恭喜${name}注册成功,请登录体验吧!</b>` // 发送的内容
        };
        //发送行为
        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                callback(error);
            }
            callback(info);
        });
    }
}
module.exports = mail;