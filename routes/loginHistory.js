var Router = require('koa-router');
var History = require('../models/loginHistory');
var bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
var router = Router({
    prefix: '/api/v1.0/loginHistory'
});

router.get('/allHistory/:id([0-9]{1,})', koaBody, async(ctx, next) => {
    console.log("hello")
    const params = ctx.params
    const userID  = params && params.id;
    console.log(params)
    let item = await History.allLoginHistory(userID);
    ctx.body = item;
});

router.get('/history', async(ctx) => {
    let item = await History.loginHistory();
    ctx.body = item;
});
module.exports = router;