var Router = require('koa-router');
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const tfaModel = require('../models/twoFactorAuthDao');
const passport = require('koa-passport');
var router = Router({
    prefix: '/api/v1.0.0/tfa'
});


router.post(`/activate`, koaBody, async(ctx, next) => {
    return passport.authenticate("jwt", { session: false }, async (err, payload) => {//Get payload
        try{
            const body = ctx.request.body
            const ID = body.userID;
            if(payload.ID != ID) throw {message: 'Unauthorised', status: 401} //Checks if user is accessing own page
            
            

            const item = await tfaModel.activateTwoFactorAuth(ID)

            ctx.body = item;
            ctx.response.status = 201;
            
        }catch(error){
            console.log(error)
            ctx.response.status = error.status;
            ctx.body = {message:error.message};
        }
    })(ctx)
});

router.post(`/deactivate`, koaBody, async(ctx, next) => {
    return passport.authenticate("jwt", { session: false }, async (err, payload) => {//Get payload
        try{
            const body = ctx.request.body
            const ID = body.userID;
            await tfaModel.twoFactorAuth(ID, ctx.request.headers['secret']).catch((e)=>{throw e})
            if(payload.ID != ID) throw {message: 'Unauthorised', status: 401} //Checks if user is accessing own page

            const item = await tfaModel.deactivateTwoFactorAuth(ID)

            ctx.body = item;
            ctx.response.status = 201;
            
        }catch(error){
            console.log(error)
            ctx.response.status = error.status;
            ctx.body = {message:error.message};
        }
    })(ctx)
});

router.get(`/:id([0-9]{1,})`, koaBody, async(ctx, next) => {
    return passport.authenticate("jwt", { session: false }, async (err, payload) => {//Get payload
        try{
            const ID = ctx.params.id;
            if(payload.ID != ID) throw {message: 'Unauthorised', status: 401} //Checks if user is accessing own page
            const item = await tfaModel.getTwoFactor(ID)

            ctx.body = item;
            ctx.response.status = 201;
            
        }catch(error){
            console.log(error)
            ctx.response.status = error.status;
            ctx.body = {message:error.message};
        }  
    })(ctx)
});

module.exports = router;