const router=require('express').Router()
const userModel= require('../model/user.model')
const crypto= require('crypto.js')
const Auth = require('../middleware/auth.middleware') 

router.post('/register',async(req, res)=>{
try {
    const {name}= req.body;
    var str= name + new Date().getTime();
    const apiKey= crypto.sha256(str).toString().slice(0,20)

    const userCreated= new userModel({name, apiKey})
    await userCreated.save()

    res.json({status:200, sucess:"user Created"})
} catch (error) {
    console.log(error)
}
})
router.post('/login', Auth.userAuthMiddleware , async(req, res)=>{
    try {
        if(req.user){
            return res.json({status:200, success: req.user})
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports= router