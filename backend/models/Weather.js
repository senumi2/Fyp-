const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    windDirection: Number,
    pressure: Number,
    cloudCover: Number,
    rainfall: Number,
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['Scheduled', 'Manual'], default: 'Scheduled' }
});

module.exports = mongoose.model('Weather', weatherSchema);