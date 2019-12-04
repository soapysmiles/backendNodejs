var Router = require('koa-router');
var userModel = require('../models/userDoa');
var bodyParser = require('koa-bodyparser');


const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
var router = Router({
    prefix: '/api/v1.0.0'
});

const passport = require('koa-passport');
require("../auth/auth");
passport.initialize()


router.get(`/user/:ID([0-9]{1,})`, passport.authenticate("jwt", { session: false }), async(ctx, next) => {
    try{
        const ID = ctx.params.ID;

        const user = await userModel.getOneByID(ID);
        ctx.body = user;
       
        ctx.response.status = 200;
    }catch(error){
        ctx.response.status = error.status || 400;
        ctx.body = {message:error.message};
    }
});

module.exports = router;