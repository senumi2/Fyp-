const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  date: Date,
  issue: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
