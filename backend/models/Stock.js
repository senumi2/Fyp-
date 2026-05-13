const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    itemName: { type: String, required: true }, // Salt, Jipsum, Artemiya, Agriculture Salt
    transactionType: { type: String, enum: ['Inward', 'Outward'], required: true },
    date: { type: Date, required: true },
    subType: { type: String }, 
    partyName: { type: String }, 
    quantity: { type: Number, required: true },
    no: { type: String,unique: true } 
}, { timestamps: true });

module.exports = mongoose.model('Stock', StockSchema);