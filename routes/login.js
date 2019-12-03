var Router = require('koa-router');
var loginModel = require('../models/login');
var bodyParser = require('koa-bodyparser');


var router = Router({
    prefix: '/login'
});

var bodyParser = require('koa-bodyparser');

router.post(`/register`,bodyParser(), async(ctx, next) => {
    try{
        const body = ctx.request.body;
        const user = {
            username : body.username,
            password :body.password,
            fName : body.fName,
            lName : body.lName,
            email :body.email,
            about :body.about || '',
            countryID : body.countryID,
            birthDate : body.birthDate
        }

        let item = await loginModel.register(ctx, user);
        ctx.body = item;
        //TODO: add some image upload
        ctx.response.status = 201;
        ctx.body = {message:"added successfully"};
    }catch(error){
        ctx.response.status = error.status;
        ctx.body = {message:error.message};
    }
});


module.exports = router;