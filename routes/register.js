var Router = require('koa-router');
var registerModel = require('../models/registerDoa');
var bodyParser = require('koa-bodyparser');
const multer = require('@koa/multer');

var router = Router({
    prefix: '/api/v1.0.0'
});

var bodyParser = require('koa-bodyparser');
const upload = multer({ dest: '/tmp/' });

router.post(`/register`, upload.single('avatar'), async(ctx, next) => {
    try{
        const body = JSON.parse(ctx.request.body.user);
        

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

        const image = {
            path : ctx.file.path,
            type: ctx.file.mimetype
        }

        let item = await registerModel.register(ctx, user, image);
        ctx.body = item;
        //TODO: add some image upload
        ctx.response.status = 201;
        
    }catch(error){
        console.log(error)
        ctx.response.status = error.status;
        ctx.body = {message:error.message};
    }
});

router.post(`/addPhoto`,  async(ctx, next) => {
    try{
        console.log(ctx.request.body)
        console.log(ctx.file)
        await registerModel.addPhoto( 1)

    }catch(error){
        console.log(error)
        ctx.response.status = error.status;
        ctx.body = {message:error.message};
    }
})



module.exports = router;