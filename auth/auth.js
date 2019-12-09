const passport = require('koa-passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var cfg = require("../config.js");
var opts = {};
var jwt = require("jwt-simple");
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = cfg.jwt.jwtSecret;
var User = require('../models/userDao')
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    if(!jwt_payload) done(new Error('No payload'), null)
    const user = await User.getJWT(jwt_payload.ID).catch((e) => {
      done(e, null)
    })
    if(!user){
      done(new Error('User not found'), null)
    }else if(jwt.encode(jwt_payload, cfg.jwt.jwtSecret) != user.jwt){
      done(new Error('JWT incorrect'),null)
    }
    done(null, jwt_payload);
    
    
  })
);


