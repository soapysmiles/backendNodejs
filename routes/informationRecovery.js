var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const informationRecoveryModel = require('../models/informationRecoveryDao')
var Valid = require('../modules/validator')
const userModel = require('../models/userDao')
var tfaModel = require('../models/twoFactorAuthDao')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
var router = Router({
    prefix: '/api/v1.0.0/informationRecovery'
});

/**
 * @name get/Questions
 * @author A.M
 * @inner
 * @param {string} email userID to get questions and answers
 */
router.get(`/username/:email`, async(ctx, next) => { 
    try{
        const email = ctx.params.email;
        Valid.checkEmail(email, 'email')
        //Gets user information
        const user = await userModel.getOneByEmail(email)
        //Sets return to user data
        ctx.body = user.username;
        ctx.response.status = 200;//a-o-kay
    }catch(error){
        ctx.response.status = error.status || 400;
        ctx.body = {message:error.message};
    }
});


/**
 * @name put/QuestionsAnswers
 * @author A.M
 * @inner
 * @param {int} ID of user
 * @param {string} question1
 * @param {string} question2
 * @param {string} answer1
 * @param {string} answer2
 */
router.put(`/`, koaBody, async(ctx, next) => { 
    return passport.authenticate("jwt", { session: false }, async (err, payload) => {//Get payload
        try{
            const body = ctx.request.body;
            const ID = body.userID;
            
            //await tfaModel.twoFactorAuth(ID, ctx.request.headers['secret']).catch((e)=>{throw e})//Check if user authenticated tfa way
            if(payload.ID != ID) throw {message: 'Unauthorised', status: 401} //Checks if user is accessing own page
            const data = {
                question1: body.question1,
                question2: body.question2,
                answer1: body.answer1,
                answer2: body.answer2
            }
            //Gets user questions
            await informationRecoveryModel.setQuestionsAnswers(ID, data)
            //Sets return to user data
            ctx.body = {message: 'Questions and answers set'};
            ctx.response.status = 200;//a-o-kay
        }catch(error){
            ctx.response.status = error.status || 400;
            ctx.body = {message:error.message};
        }
    })(ctx)
});

/**
 * @name get/Questions
 * @author A.M
 * @inner
 * @param {int} ID userID to get questions and answers
 */
router.get(`/:ID([0-9]{1,})`, async(ctx, next) => { 
    try{
        const ID = ctx.params.ID;
        //Gets user questions
        const questions = await informationRecoveryModel.getQuestions(ID)
        //Sets return to user data
        ctx.body = questions;
        ctx.response.status = 200;//a-o-kay
    }catch(error){
        ctx.response.status = error.status || 400;
        ctx.body = {message:error.message};
    }
});

/**
 * @name post/Answers
 * @author A.M
 * @inner
 * @param {int} ID userID to get questions and answers
 * @param {string} answer1
 * @param {string} answer2
 * @returns {Object} code for reset consisting of hash and salt
 */
router.post(`/`, koaBody, async(ctx, next) => { 
    try{
        const body = ctx.request.body;
        const ID = body.userID;
        
        const data = {
            answer1: body.answer1,
            answer2: body.answer2
        }
        //Check user answers
        const result = await informationRecoveryModel.checkAnswers(ID, data)
            .catch((e) => {throw e})
            .then((res) => {
                return res
            })
        //Sets return to user data
        ctx.body = {code: result};
        ctx.response.status = 200;//a-o-kay
    }catch(error){
        ctx.response.status = error.status || 400;
        ctx.body = {message:error.message};
    }
});


/**
 * @name post/Reset New password
 * @author A.M
 * @inner
 * @param {int} ID userID to get questions and answers
 * @param {string} answer1
 * @param {string} answer2
 * @param {string} newPassword
 */
router.post(`/reset`, koaBody, async(ctx, next) => { 
    try{
        const body = ctx.request.body;
        const ID = body.userID;
        
        const data = {
            codeHash: body.codeHash,
            codeSalt: body.codeSalt,
            newPassword: body.newPassword
        }
        //Change user password
        await informationRecoveryModel.passwordReset(ID, data)
            .catch((e) => {throw e})
        
        ctx.body = {message:"Password reset"};
        ctx.response.status = 200;//a-o-kay
    }catch(error){
        ctx.response.status = error.status || 400;
        ctx.body = {message:error.message};
    }
});

module.exports = router;