const userModel = require("../models/userModel");
const driverModel = require("../models/driverModel");
// const blackListtokenModel = require("../models/deletedTokenModel");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

module.exports.checkUser = async (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message : 'Unauthorized token' });
    }
    const decoded = jwt.verify(token,process.env.JWT);
    const user = await redisClient.get(`auth:${req.user._id}`);
    if(user){
        req.user = JSON.parse(user);
        return next();
    }   
    try{
        const user = await userModel.findById(decoded._id);
        req.user = user;
        await redisClient.setEx(`auth:${driver._id}`,86400,JSON.stringify(user));
        return next();
    } catch(err){
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports.checkDriver = async (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message : 'Unauthorized token' });
    }
    const decoded = jwt.verify(token,process.env.JWT);
    const driver = await redisClient.get(`auth:${decoded._id}`);
    if(driver){
        req.driver = JSON.parse(driver);
        return next();
    }
    try{
        const driver = await driverModel.findById(decoded._id);
        req.driver = driver;
        await redisClient.setEx(`auth:${driver._id}`,86400,JSON.stringify(driver));
        return next();

    } catch(err){
        return res.status(401).json({ message: 'Unauthorized' });
    }
}