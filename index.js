var Koa = require('koa');

var admin = require('./routes/admin');
var loginHis = require('./routes/loginHistory')

var app = new Koa();

app.use(admin.routes());
app.use(loginHis.routes());

var port = process.env.PORT || 3000;

app.listen(port);