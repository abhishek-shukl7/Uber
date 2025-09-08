const axios = require("axios");
const driverModel = require("../models/driverModel");

module.exports.getAddressCoordinates = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try{
        const response = await axios.get(url);
        if(response.data.status == "OK"){
            const location = response.data.results[0].geometry.location;
            return {
                ltd : location.lat,
                lng : location.lng
            };
        }else{
            throw new Error('Unable to fetch coordinates');
        }
    }catch(error){
        console.log(error);
        await logModel.create({ logname: 'mapService getAddressCoordinates', log: JSON.stringify(error) });
        throw error;
    }
}

module.exports.getDistanceTime = async (origin , destination) => {
    if(!origin || !destination){
        throw new Error('Origin or destination is missing.');
    }

    // console.log(origin,destination);

    const apiKey = process.env.GOOGLE_MAPS_KEY;
    
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try{
        const response = await axios.get(url);
        // console.log(response.data);
        if(response.data.status == "OK"){
            if(response.data.rows[0].elements[0].status == "ZERO_RESULTS"){
                throw new Error('No routes found');
            }else{
                return response.data.rows[0].elements[0];
            }
        }else{
            throw new Error('Unable to get distance time.');
        }
    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports.getDriverDistanceTime = async (origin , destination) => {
    if(!origin || !destination){
        throw new Error('Origin or destination is missing.');
    }

    const originCoords = `${origin.ltd},${origin.lng}`;
    const destinationCoords = `${destination.ltd},${destination.lng}`;

    const apiKey = process.env.GOOGLE_MAPS_KEY;
    
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords}&destinations=${destinationCoords}&key=${apiKey}`;
    
    try{
        const response = await axios.get(url);

        if(response.data.status == "OK"){
            if(response.data.rows[0].elements[0].status == "ZERO_RESULTS"){
                throw new Error('No routes found');
            }else{
                return response.data.rows[0].elements[0];
            }
        }else{
            throw new Error('Unable to get distance time.');
        }
    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports.getSuggestions = async (input) => {
    if(!input){
        throw new Error('Input is required  .');
    }

    const apiKey = process.env.GOOGLE_MAPS_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try{
        const response = await axios.get(url);
        if(response.data.status == "OK"){
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        }else{
            throw new Error('Unable to get suggestions.');
        }
    }catch(error){
        console.log(error);
        throw error;
    }    
}

module.exports.driversInRadius = async (ltd,lng,radius) => {
    const driversInRadius = await driverModel.find({
        location : {
            $geoWithin:{
                $centerSphere : [ [ ltd,lng ], radius / 6371 ]
            }
        }
    });

    // const driversInRadius = await driverModel.aggregate([
    //     {
    //         $geoNear: {
    //             near: {
    //                 type: "Point",
    //                 coordinates: [lng, ltd] // IMPORTANT: MongoDB uses [longitude, latitude]
    //             },
    //             distanceField: "distanceKm", // The output field name for the distance
    //             spherical: true,
    //             maxDistance: radius * 1000 // Convert radius from km to meters
    //         }
    //     },
    //     {
    //         $project: {
    //             // Include fields from the original driver document you want to keep
    //             fullname: 1,
    //             // Convert the distance from meters (the default) to kilometers
    //             distanceKm: { $divide: ["$distanceKm", 1000] }
    //         }
    //     }
    // ]);


    return driversInRadius;
}