const userModel = require("../models/userModel");
const driverModel = require("../models/driverModel");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { valid: false, expired: true, decoded: null };
    } else {
      return { valid: false, expired: false, decoded: null };
    }
  }
}

module.exports.checkUser = async (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message : 'Unauthorized token' });
    }
    const result = verifyToken(token);
    if (!result.valid) {
        if (result.expired) {
            return res.status(401).json({ message: 'Token expired' });
        } else {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        const user = await redisClient.get(`auth:${result.decoded._id}`);
        if(user){
            req.user = JSON.parse(user);
            return next();
        }   
        try{
            const user = await userModel.findById(decoded._id);
            req.user = user;
            await redisClient.setEx(`auth:${user._id}`,86400,JSON.stringify(user));
            return next();
        } catch(err){
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
}

module.exports.checkDriver = async (req,res,next) => {
    console.log('middleware');
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message : 'Unauthorized token' });
    }
    const result = verifyToken(token);

    if (!result.valid) {
        if (result.expired) {
            return res.status(401).json({ message: 'Token expired' });
        } else {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        const driver = await redisClient.get(`auth:${result.decoded._id}`);
        if(driver){
            req.driver = JSON.parse(driver);
            console.log('redis middleware end');
            return next();
        }
        try{
            const driver = await driverModel.findById(decoded._id);
            req.driver = driver;
            await redisClient.setEx(`auth:${driver._id}`,86400,JSON.stringify(driver));
            console.log('db middleware end');
            return next();

        } catch(err){
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
}