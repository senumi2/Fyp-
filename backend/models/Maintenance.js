const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema({
  // 'issue' වෙනුවට 'description' ලෙස වෙනස් කළා
  description: { type: String, required: true }, 
  status: { type: String, required: true }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Maintenance", MaintenanceSchema);