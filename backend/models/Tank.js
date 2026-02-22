const mongoose = require('mongoose');

const TankSchema = new mongoose.Schema({
    type: String,
    capacity: String,
    totalPonds: Number,
    location: String,
    salinityRecords: [{
        date: Date,
        level: Number,
        process: String
    }],
    weatherRecords: [{
        date: Date,
        status: String
    }]
});

module.exports = mongoose.model('Tank', TankSchema);