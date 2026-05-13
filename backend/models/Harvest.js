const mongoose = require('mongoose');


const HarvestSchema = new mongoose.Schema({
    category: { 
        type: String, 
        required: true,
        unique: true 
    },
    records: [{
        date: { type: Date, default: Date.now },
        type: { type: String },
        quantity: { type: Number }
    }]
}, { timestamps: true });


module.exports = mongoose.models.Harvest || mongoose.model('Harvest', HarvestSchema);