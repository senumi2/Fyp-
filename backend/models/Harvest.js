const mongoose = require('mongoose');

// Schema එක අලුතින්ම නිර්වචනය කරන්න
const HarvestSchema = new mongoose.Schema({
    category: { 
        type: String, 
        required: true,
        unique: true // Category එක duplicate වීම වැලැක්වීමට
    },
    records: [{
        date: { type: Date, default: Date.now },
        type: { type: String },
        quantity: { type: Number }
    }]
}, { timestamps: true });

// පවතින Model එක මකා දමා අලුතින් නිර්මාණය කිරීමට (Hot reloading වලදී වැදගත් වේ)
module.exports = mongoose.models.Harvest || mongoose.model('Harvest', HarvestSchema);