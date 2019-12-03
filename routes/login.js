var Router = require('koa-router');
var loginModel = require('../models/login');
var bodyParser = require('koa-bodyparser');


var router = Router({
    prefix: '/login'
});

var bodyParser = require('koa-bodyparser');

router.post(`/addUser`,bodyParser(), async(ctx, next) => {
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
    console.log(user)

    let item = await loginModel.newUser(user);
    ctx.body = item;
    //TODO: add some image upload
});

module.exports = router;