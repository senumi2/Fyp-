const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  issue: { type: String, required: true },
  status: { type: String, default: 'Pending' }
},

{ 
  timestamps: true 
});

module.exports = mongoose.model("Issue", IssueSchema);
