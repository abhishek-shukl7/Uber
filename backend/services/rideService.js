const mapService = require('./mapService');
const rideModel = require('../models/rideModel');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const driverModel = require('../models/driverModel');

async function getFare(pickup,destination){
    if(!pickup || !destination){
        throw new Error('Pickup or Destination is missing.');
    }

    const distanceTime = await mapService.getDistanceTime(pickup,destination);
    // console.log('distanceTime', distanceTime);
    
    const base = {
        car: 50,
        moto: 20,
        auto: 30
    };

    const perkmRate = {
        car: 15,
        moto: 7,
        auto: 10
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    }

    const fare = {
        auto: Math.round(base.auto + ((distanceTime.distance.value / 1000) * perkmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(base.car + ((distanceTime.distance.value / 1000) * perkmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(base.moto + ((distanceTime.distance.value / 1000) * perkmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };
    const nearestDriver = await getDriverDistanceTime(pickup);
    // console.log('nearestDriver', nearestDriver);
    const nearestDriverDetails = {};
    for (const type of Object.keys(nearestDriver)) {
        nearestDriverDetails[type] = {
            name: nearestDriver[type]._doc.fullname.firstname + ' ' + nearestDriver[type]._doc.fullname.lastname,
            capacity: nearestDriver[type]._doc.vehicle.capacity,
            duration: nearestDriver[type].distanceTime.duration.text
        };
    }

    const result = {
        nearestDriverDetails: nearestDriverDetails,
        fare: fare,
        distance:distanceTime.distance.value,
        duration:distanceTime.duration.value
    };

    return result;
}
module.exports.getFare = getFare;

function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}

async function getDriverDistanceTime(pickup) {
    if(!pickup){
        throw new Error('Pickup is missing.');
    }

    try{
        const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
        const driversInRadius = await mapService.driversInRadius(pickupCoordinates.ltd,pickupCoordinates.lng,50);
        const groupedDrivers = {
            car: [],
            auto: [],
            moto: []
        };

        driversInRadius.forEach(driver => {
            if (groupedDrivers[driver.vehicle.vehicleType]) {
                groupedDrivers[driver.vehicle.vehicleType].push(driver);
            }
        });
        const nearestDrivers = {};

        for (const type of Object.keys(groupedDrivers)) {
            let minDistance = Infinity;
            let nearestDriver = null;

            for (const driver of groupedDrivers[type]) {
                const distanceTime = await mapService.getDriverDistanceTime(pickupCoordinates, driver.location);
                // console.log('driver', driver, 'distanceTime', distanceTime);
                if (distanceTime.distance.value < minDistance) {
                    minDistance = distanceTime.distance.value;
                    nearestDriver = { ...driver, distanceTime };
                }
            }
            if (nearestDriver) {
                nearestDrivers[type] = nearestDriver;
            }
        }
        
        if(nearestDrivers){
            return nearestDrivers;    
        }else{
            throw new Error('Unable to get driver distance time.');
        }
    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports.createRide = async ({user,pickup,destination,vehicleType}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const data = await getFare(pickup,destination);
    // console.log("data" , data);
    const fare = data.fare;
    const distance = data.distance;
    const duration = data.duration;
    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        distance,
        duration,
        otp: getOtp(6),
        fare: fare[ vehicleType ]
    });

    return ride;
}

module.exports.confirmRide = async ({ rideId, driver}) => {
    if (!rideId) {
        throw new Error('Ride Id is required');
    }

    await rideModel.findOneAndUpdate({ 
        _id : rideId
        },
    {
        status : 'accepted',
        driver: driver._id
    });

    const ride = await rideModel.findOne({
        _id : rideId
    }).populate('user').populate('driver').select('+otp');

    if(!ride){
        throw new Error('Ride Not Found.');
    }

    return ride;
}

module.exports.startRide = async ({ rideId,otp}) => {
    if (!rideId || !otp) {
        throw new Error('Ride Id or OTP is missing.');
    }

    const ride = await rideModel.findOne({
        _id : rideId
    }).populate('user').populate('driver').select('+otp');

    if(!ride){
        throw new Error('Ride Not Found.');
    }

    if(ride.status != 'accepted'){
        throw new Error('Ride Not Accepted.');
    }
    if(ride.otp != otp){
        throw new Error('OTP Not Matched.');
    }

    await rideModel.findOneAndUpdate({
        _id : rideId
    },{
        status: 'ongoing'
    });

    return ride;
}

module.exports.endRide = async ({ rideId,driver}) => {
    if (!rideId) {
        throw new Error('Ride Id is required');
    }
    const ride = await rideModel.findOne({
        _id : rideId
    }).populate('user').populate('driver').select('+otp');

    if(!ride){
        throw new Error('Ride Not Found.');
    }
    if(ride.status != 'ongoing'){
        throw new Error('Ride Not ongoing.');
    }


    await rideModel.findOneAndUpdate({ 
        _id : rideId
        },
    {
        status : 'completed',
        driver: driver._id
    });


    return ride;
}

module.exports.driverDetails = async ({driverId}) => {
    if (!driverId) {
        throw new Error('All fields are required');
    }

    const driverDetails = await rideModel.find({
        driver: driverId,
        status: { $ne: 'pending' || 'cancelled' }
    });
    
    return driverDetails;
}