const userModel= require('../model/user.model')

exports.userAuthMiddleware= async (req, res, next)=>{
    try {
        const apiKey= req.query.apiKey;
        if(!apiKey){
            return res.json({status:400, message:"apiKey is mandatory"})
        }
        const getUser = await userModel.findOne({apiKey:apiKey})

        if(!getUser){
            return res.json({status:400, message:"apiKey is don't exists"})
        }
        req.user= getUser;
        next();
    } catch (error) {
        
    }
}