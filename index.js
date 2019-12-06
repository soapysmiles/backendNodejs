var Koa = require('koa');
var admin = require('./routes/admin');
var login = require('./routes/login');
var register = require('./routes/register');
var user = require('./routes/user');
const { userAgent } = require('koa-useragent');
const passport = require('koa-passport');
const cors = require('@koa/cors');
const serve = require('koa-static')
const mount = require("koa-mount");
require("./auth/auth");
var app = new Koa();


app.use(cors());
app.use(userAgent);
app.use(login.routes());
app.use(admin.routes());
app.use(register.routes());
app.use(user.routes());
app.use(passport.initialize())

var port = process.env.PORT || 3000;
app.use(mount("/", serve("./public")));
app.listen(port);