var Router = require('koa-router');
var loginModel = require('../models/loginDoa');
var bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})

const passport = require('koa-passport');
require("../auth/auth");
passport.initialize()

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
        //Login user
        let item = await loginModel.login(user)

        ctx.body = item;
        ctx.response.status = 201;
    }catch(error){
        console.log(error)
        ctx.response.status = error.status;
        ctx.body = {message:error.message};
    }
});

router.post("/user",passport.authenticate("jwt", { session: false }), function(ctx, next) {
    try{
        ctx.body = {message: 'gained auth'};
        ctx.response.status = 201;
    }catch(error){
        console.log(error)
        ctx.response.status = error.status;
        ctx.body = {message:error.message};
    }
});


module.exports = router;