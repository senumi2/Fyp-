const mongoose = require("mongoose");
const maintenanceRepairLogsSchema = new mongoose.Schema({
    equipment: { type: String, required: true },
    issue: { type: String, required: true },
    cost: { type: Number, required: true },
    statuse: { type: String, required: true }, // fixed/ongoing/pending
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.models.MaintenanceRepairLogs || mongoose.model("MaintenanceRepairLogs", maintenanceRepairLogsSchema);