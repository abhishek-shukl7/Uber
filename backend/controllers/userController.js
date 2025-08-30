const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const userService = require("../services/userService");
// const blackListTokenModel = require("../models/deletedTokenModel");
const redisClient = require("../config/redis");

module.exports.getUser = async (req,res,next) => {
    res.status(200).json(req.user);
}

module.exports.createUser = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    const { fullname, email , password} = req.body;
    const userExists = await userModel.findOne({email});

    if(userExists){
        return res.status(400).json({ message : 'User already exists.'});
    }

    const hashedPwd = await userModel.hashPwd(password);
    const user = await userService.createUser({
        firstname : fullname.firstname,
        lastname : fullname.lastname,
        email,
        password: hashedPwd
    });

    const token = user.generateAuthToken();
    await redisClient.setEx(`auth:${user._id}`,86400,JSON.stringify(user));
    return res.status(200).json({token,user});
}

module.exports.login = async (req,res,next)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }
    const { email , password } = req.body;
    const user = await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({message : 'Invalid email or password' });
    }
    const matchPwd = await user.comparePwd(password);
    if(!matchPwd){
        return res.status(401).json({message : 'Invalid email or password' });
    }
    const token = user.generateAuthToken();
    await redisClient.setEx(`auth:${user._id}`,86400,JSON.stringify(user));
    return res.status(200).json({token,user});
}

module.exports.logout = async(req,res,next) => {
    // const token = req.headers.authorization?.split(' ')[1];
    await redisClient.del(`auth:${req.user._id}`);
    res.status(200).json({message : 'Logged out'});
    
}