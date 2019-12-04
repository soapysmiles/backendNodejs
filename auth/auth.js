const passport = require('koa-passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var cfg = require("../config.js");
var opts = {};
var jwt = require("jwt-simple");
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = cfg.jwt.jwtSecret;
var User = require('../models/userDoa')
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    const user = await User.getOneByID(jwt_payload.ID).catch((e) => {
        done(null, null)
    })
    if(jwt.encode(jwt_payload, cfg.jwt.jwtSecret) !== user.jwt) done(null,null)
    done(null, jwt_payload);
  })
);