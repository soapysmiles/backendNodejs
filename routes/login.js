var Router = require('koa-router');
var loginModel = require('../models/login');
var bodyParser = require('koa-bodyparser');

var router = Router({
    prefix: '/login'
});

var bodyParser = require('koa-bodyparser');

router.post('/addUser:', async(ctx, next) => {
    const user = {
        username : ctx.params.username,
        pass :ctx.params.password,
        fName : ctx.params.firstName,
        lName : ctx.params.lastName,
        email :ctx.params.email,
        about :ctx.params.about || '',
        countryID : ctx.params.countryID,
        birthDate : ctx.params.birthDate
    }

    let item = await loginModel.newUser(user);
    ctx.body = item;
    //TODO: add some image upload
});

module.exports = router;