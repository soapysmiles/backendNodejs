var Router = require('koa-router');
var userModel = require('../models/userDoa');
var bodyParser = require('koa-bodyparser');


const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
var router = Router({
    prefix: '/api/v1.0.0'
});

const passport = require('koa-passport');
require("../auth/auth");
passport.initialize()


router.get(`/user/:ID([0-9]{1,})`, async(ctx, next) => {
    //Authenticate user entry
    return passport.authenticate("jwt", { session: false }, async (err, payload) =>{
        try{
            if(err) throw {message: err.message}
            const ID = ctx.params.ID;
            //if(payload.ID !== ID) throw {message: 'Unauthorised'} //Checks if user is accessing own page
            
            //Gets user information
            const user = await userModel.getOneByID(ID).catch((err) => {
                if(err) throw {message: err.message}
            });

            //Sets return to user data
            ctx.body = user;
            ctx.response.status = 200;//a-o-kay
        }catch(error){
            ctx.response.status = error.status || 400;
            ctx.body = {message:error.message};
        }
    })(ctx)
});

module.exports = router;