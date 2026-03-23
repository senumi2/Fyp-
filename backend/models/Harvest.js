const mongoose = require('mongoose');

const HarvestSchema = new mongoose.Schema({
    category: { type: String, required: true }, // Salt, Jipsum, Artimiya, Agriculture Salt
    records: [{
        date: { type: Date, default: Date.now },
        type: String,
        quantity: Number
    }]
});

module.exports = mongoose.model('Harvest', HarvestSchema);