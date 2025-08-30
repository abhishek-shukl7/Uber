const { validationResult } = require("express-validator");
const driverModel = require("../models/driverModel");
const driverService = require("../services/driverService");
// const blackListTokenModel = require("../models/deletedTokenModel");
const redisClient = require("../config/redis");

module.exports.getDriver = async (req,res,next) => {
    res.status(200).json(req.driver);
}

module.exports.createDriver = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    const { fullname, email , password , vehicle} = req.body;
    const driverExists = await driverModel.findOne({ email });

    if(driverExists){
        return res.status(400).json({ message : 'Driver already exists.'});
    }

    const hashedPwd = await driverModel.hashPwd(password);
    const driver = await driverService.createDriver({
        firstname : fullname.firstname,
        lastname : fullname.lastname,
        email,
        password: hashedPwd,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
        vehicleName: vehicle.vehicleName
    });

    const token = driver.generateAuthToken();
    await redisClient.setEx(`auth:${driver._id}`,86400,JSON.stringify(driver));

    return res.status(200).json({token,driver});
}

module.exports.loginDriver = async (req,res,next)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()} );
    }

    const { email , password } = req.body;
    
    const driver = await driverModel.findOne({email}).select('+password');

    if(!driver){
        return res.status(401).json({message : 'Invalid email or password' });
    }

    const matchPwd = await driver.comparePwd(password);
    if(!matchPwd){
        return res.status(401).json({message : 'Invalid email or password' });
    }

    const token = driver.generateAuthToken();

    await redisClient.setEx(`auth:${driver._id}`,86400,JSON.stringify(driver));
    // res.cookie('token',token);

    return res.status(200).json({token,driver});
}

module.exports.logoutDriver = async(req,res,next) => {

    const token = req.headers.authorization?.split(' ')[1];

    // await blackListTokenModel.create({ token });
    await redisClient.del(`auth:${req.driver._id}`);

    res.status(200).json({message : 'Logged out'});
    
}