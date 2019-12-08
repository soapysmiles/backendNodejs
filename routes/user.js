var Router = require('koa-router');
var userModel = require('../models/userDao');
var bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const countryModel = require('../models/countryDao')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
var router = Router({
    prefix: '/api/v1.0.0'
});


/**
 * @name get/user/:userID gets user details based on userID
 * @author A.M
 * @inner
 * @param {INT} userID
 * @returns {Object} consisting of user details
 */
router.get(`/user/:ID([0-9]{1,})`,passport.authenticate("jwt", { session: false }), async(ctx, next) => { 
    try{
        const ID = ctx.params.ID;
        
        //Gets user information
        const user = await userModel.getOneByID(ID).catch((err) => {
            if(err) throw {message: err.message}
        });
        //Gets user country
        const country = await countryModel.getCountryByID(user.countryID).catch((err) => {
            if(err) throw {message: err.message}
        });

        //Set into user obj
        user.countryAbbrev = country.abbreviation;
        user.countryName = country.name;
        //Sets return to user data
        ctx.body = user;
        ctx.response.status = 200;//a-o-kay
    }catch(error){
        ctx.response.status = error.status || 400;
        ctx.body = {message:error.message};
    }
});

module.exports = router;