var Router = require('koa-router');
var loginModel = require('../models/loginDao');
var bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const device = require('../models/deviceDao');
const passport = require('koa-passport');
var tfaModel = require('../models/twoFactorAuthDao')

var router = Router({
    prefix: '/api/v1.0.0'
});

router.post(`/login`,koaBody, async(ctx, next) => {
    try{
        const body = ctx.request.body
        const user = {
            username : body.username,
            password : body.password
        }
        let userAg = ctx.userAgent;
           
        const deviceType = await device.getDeviceFromUserAgent(userAg['_agent']);
        const browser = userAg['_agent'].browser;
        const attempt = {
            ip : ctx.request.ip,
            deviceType :deviceType,
            browser : browser
        }
        //Login user
        let item = await loginModel.login(user, attempt)
        
        if(item.user.deleted == 1){throw ({message: 'User account is deleted', status: 401})}
        ctx.body = item;
        ctx.response.status = 201;
    }catch(error){
        console.log(error)
        ctx.response.status = error.status;
        ctx.body = {message:error.message};
    }
});

router.post(`/tfalogin`,koaBody, async(ctx, next) => {
    return passport.authenticate("jwt", { session: false }, async (err, payload) => {//Get payload
        try{
            const body = ctx.request.body
            const ID = body.userID  
            const token = body.token
            const secret = await tfaModel.authenticateTwoFactorAuth(ID, token).catch((e)=> {throw {message: e.message, status: 401}})

            ctx.body = {message:"authenticated", secret: secret};
            ctx.response.status = 201;
        }catch(error){
            console.log(error)
            ctx.response.status = error.status;
            ctx.body = {message:error.message};
        }
    
        
    })(ctx)
});





module.exports = router;