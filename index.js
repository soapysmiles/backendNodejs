var Koa = require('koa');

var admin = require('./routes/admin');

var app = new Koa();

app.use(admin.routes());

var port = process.env.PORT || 3000;

app.listen(port);