var Router = require('koa-router');
var adminModel = require('../models/admin');
var bodyParser = require('koa-bodyparser');

var router = Router({
    prefix: '/api/v1.0/admin'
});

var bodyParser = require('koa-bodyparser');

router.get('/create_db', async(ctx, next) => {
    let item = await adminModel.createTables();
    ctx.body = item;
});

module.exports = router;