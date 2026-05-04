const mongoose = require('mongoose');

const OperationalExpenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Raw Materials', 'Stationery', 'Cleaning Materials', 'Other'], 
        default: 'Other' 
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OperationalExpense', OperationalExpenseSchema);