var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const passwordResetModel = require('../models/passwordResetDoa')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
var router = Router({
    prefix: '/api/v1.0.0/passwordreset'
});

router.get(`/:ID([0-9]{1,})`, async(ctx, next) => { 
    return passport.authenticate("jwt", { session: false }, async (err, payload) => {//Get payload
        try{
            const ID = ctx.params.ID;
            if(payload.ID != ID) throw {message: 'Unauthorised', status: 401} //Checks if user is accessing own page
            //Gets user questions
            passwordResetModel.getQuestionsAnswers(ID)
            //Sets return to user data
            ctx.body = questions;
            ctx.response.status = 200;//a-o-kay
        }catch(error){
            ctx.response.status = error.status || 400;
            ctx.body = {message:error.message};
        }
    })(ctx)
});

module.exports = router;