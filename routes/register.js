var Router = require('koa-router');
var registerModel = require('../models/registerDao');
var bodyParser = require('koa-bodyparser');

const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
var router = Router({
    prefix: '/api/v1.0.0'
});

var bodyParser = require('koa-bodyparser');

/**
 * @name post/register
 * @author A.M
 * @inner
 * @param {string} username
 * @param {string} password
 * @param {string} fName - first name
 * @param {string} lName - last name
 * @param {string} email - email
 * @param {string} about - about user
 * @param {INT} countryID - country of which user belongs
 * @param {string} birthDate - DOB
 * @param {file (image)} avatar - the user's avatar image
 * @param {string} token TFA token from user
 * @returns {Object} consisting of secret 
 */
router.post(`/register`, koaBody, async(ctx, next) => {
    try{
        const body = ctx.request.body
        
        //Get user data
        const user = {
            username : body.username,
            password :body.password,
            fName : body.fName,
            lName : body.lName,
            email :body.email,
            about :body.about || '',
            countryID : body.countryID,
            birthDate : body.birthDate
        }
        //Get image information
        let image
        if(ctx.request.files.avatar){//Check user uploaded image
            const {path, type} = ctx.request.files.avatar
            image = {
                path : path,
                type: type
            }
        }

        //Register user
        let item = await registerModel.register(ctx, user, image);

        ctx.body = item;
        ctx.response.status = 201;
        
    }catch(error){
        console.log(error)
        ctx.response.status = error.status;
        ctx.body = {message:error.message};
    }
});


module.exports = router;