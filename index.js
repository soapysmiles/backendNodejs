var Koa = require('koa');
var admin = require('./routes/admin');
var login = require('./routes/login')
var register = require('./routes/register');

var app = new Koa();

app.use(login.routes());
app.use(admin.routes());
app.use(register.routes());

var port = process.env.PORT || 3000;

app.listen(port);