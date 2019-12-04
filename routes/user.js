var Router = require('koa-router');
var registerModel = require('../models/registerDoa');
var bodyParser = require('koa-bodyparser');

const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
var router = Router({
    prefix: '/api/v1.0.0'
});

var bodyParser = require('koa-bodyparser');