var Koa = require('koa');

var admin = require('./routes/admin');
var login = require('./routes/login');

var app = new Koa();


app.use(admin.routes());
app.use(login.routes())
var port = process.env.PORT || 3000;

app.listen(port);