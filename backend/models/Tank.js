const mongoose = require('mongoose');

const TankSchema = new mongoose.Schema({
    type: { type: String, required: true }, // Condenser, Evaporator, Crystallizer
    capacity: String,
    totalPonds: Number,
    location: String,
    currentSalinity: { type: Number, default: 0 }, 
    salinityRecords: [{
        date: { type: Date, default: Date.now },
        level: Number, // Be' value
        process: String,
        status: { type: String, default: 'Stable' } // Stable, Ready to Move, High
    }],
    maintenanceLogs: [{
        date: { type: Date, default: Date.now },
        task: String, // Desilting, Bund Repair
        startDate: String, 
        endDate: String,
        performedBy: String,
        description: String
    }],
    weatherRecords: [{
        date: { type: Date, default: Date.now },
        status: String
    }]
});

module.exports = mongoose.model('Tank', TankSchema);