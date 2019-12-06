var Router = require('koa-router');
var History = require('../models/loginHistory');
var bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
var router = Router({
    prefix: '/api/v1.0/loginHistory'
});

router.get('/allHistory/', async(ctx) => {
   // console.log("yoo")
    const params = ctx.params
    const userID  = params && params.id;
    //console.log(params)
    let item = await History.allLoginHistory(6, 1, 3);
    ctx.body = item;
});
//:id([0-9]{1,})
router.get('/history/', async(ctx) => {
    console.log("yoo")
    const params = ctx.params
    const userID  = params && params.id;
    let item = await History.loginHistory(2);
    ctx.body = item;
});
module.exports = router;