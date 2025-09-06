const mongoose = require("mongoose");

function connectDB(){
    console.log(process.env.MONGO_URI);
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Mongo DB Connected');
    }).catch(err => {
        console.log('MongoDB error',err);
    })
}

module.exports = connectDB;