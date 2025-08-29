const driverModel = require('../models/driverModel');

module.exports.createDriver = async ({
    firstname,lastname,email,password,color,plate,capacity,vehicleType,vehicleName
}) => {
    if(!firstname || !lastname || !password || !color || !plate || !capacity || !vehicleType || !vehicleName){
        throw new Error('Required fields are missing.');
    }

    const driver = driverModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle:{
            color,
            plate,
            capacity,
            vehicleType,
            vehicleName
        }
    });

    return driver;
}