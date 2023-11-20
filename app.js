const express = require('express');
const bodyparser= require('body-parser')
const UserRouter= require('./router/user.router')
const SimliarS3Router= require('./router/similartos3.router.js')
const app = express()

app.use(bodyparser.json());
app.use('/', UserRouter)
app.use('/',SimliarS3Router);

module.exports= app;
