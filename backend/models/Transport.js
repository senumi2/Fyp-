const mongoose = require("mongoose");
const transportSchema = new mongoose.Schema({
    vehicle: { type: String, required: true },
    route: { type: String, required: true },
    fuelCost: { type: Number, required: true },
    maintenance: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Transport", transportSchema);