const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    logname: {
        type: String,
    },
    log: {
        type: String,
        required: true,
    },
    timestamp: { type: Date, default: Date.now }
});


const logModel = mongoose.model('log',logSchema);

module.exports = logModel;