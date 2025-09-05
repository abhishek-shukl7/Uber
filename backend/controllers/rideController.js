const { validationResult } = require("express-validator");
const mapService = require("../services/mapService");
const rideService = require("../services/rideService");
const rideModel = require("../models/rideModel");
const { sendMessageToSocketId } = require("../socket");


module.exports.getFare = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array() });  
    }

    const { pickup , destination } = req.query;

    try{
        const fare = await rideService.getFare(pickup,destination);
        return res.status(200).json(fare);
    } catch(err){
        return res.status(404).json({ message: "Route Not Found."});
    }
}

module.exports.createRide = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array() });  
    }

    const { user, pickup , destination , vehicleType } = req.body;

    try{
        const ride = await rideService.createRide({user:req.user._id,pickup,destination,vehicleType});
        const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
        const driversInRadius = await mapService.driversInRadius(pickupCoordinates.ltd,pickupCoordinates.lng,2);
        const rideWithUser = await rideModel.findOne({ _id: ride._id}).populate('user');

        driversInRadius.map(driver => {
            sendMessageToSocketId(driver.user.socketId,{
                event: 'new-ride',
                data: rideWithUser
            });
        });
        sendMessageToSocketId(rideWithUser.user.socketId, {
            event: 'new-ride',
            data: rideWithUser
        });
        
        return res.status(201).json(ride);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message})
    }
}

module.exports.confirmRide = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });  
    }

    const { rideId } = req.body;

    try{
        const ride = await rideService.confirmRide({rideId, driver: req.driver});
        return res.status(200).json(ride);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message})
    }
}

module.exports.startRide = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){  
        return res.status(400).json({errors: errors.array() });  
    }

    const { rideId,otp } = req.query;

    try{
        const ride = await rideService.startRide({rideId,otp, driver: req.driver});
        res.status(200).json(ride);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message})
    }
}

module.exports.endRide = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){  
        return res.status(400).json({errors: errors.array() });  
    }

    const { rideId } = req.body;

    try{
        const ride = await rideService.endRide({rideId,driver: req.driver});

        sendMessageToSocketId(ride.user.socketId,{
            event: 'ride-ended',
            data: ride
        });
        return res.status(200).json(ride);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message})
    }
}

module.exports.driverRides = async (req,res,next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){  
        return res.status(400).json({errors: errors.array() });  
    }
    try{
        const driverRides = await rideService.driverRides({driverId:req.driver._id});
        return res.status(200).json(driverRides);
        
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message})
    }
}