const mongoose = require("mongoose");

async function connectDB(){
    await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Mongo DB Connected');
    }).catch(err => {
        console.log('MongoDB error',err);
    })
}

module.exports = connectDB;