var Router = require('koa-router');
var History = require('../models/loginHistory');
var bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
var router = Router({
    prefix: '/api/v1.0/loginHistory'
});

router.get('/allHistory/', async(ctx) => {
   
    const params = ctx.params
    const userID  = params && params.id;

    let item = await History.allLoginHistory(userID, 1, 3);
    ctx.body = item;
});
//:id([0-9]{1,})
router.get('/history/', async(ctx) => {
    const params = ctx.params
    const userID  = params && params.id;
    let item = await History.loginHistory(userID, 1, 3);
    ctx.body = item;
});
module.exports = router;