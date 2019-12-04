var Router = require('koa-router');
var User = require('../models/userDoa');
var bodyParser = require('koa-bodyparser');

const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
var router = Router({
    prefix: '/api/v1.0.0'
});

router.get("/user:ID({1,}",passport.authenticate("jwt", { session: false }), function(ctx, next) {
    try{
        const ID = ctx.params.ID;

        const user = User.getOneByID(ID);
        ctx.body = user;
       
        ctx.response.status = 201;
    }catch(error){
        console.log(error)
        ctx.response.status = error.status;
        ctx.body = {message:error.message};
    }
});

var bodyParser = require('koa-bodyparser');