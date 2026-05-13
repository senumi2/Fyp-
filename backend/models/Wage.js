const mongoose = require("mongoose");

const wageSchema = new mongoose.Schema({
    workerName: { type: String, required: true },
    role: { type: String, required: true },
    hoursWorked: { type: Number, required: true },
    wageRate: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    date: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("Wage", wageSchema);