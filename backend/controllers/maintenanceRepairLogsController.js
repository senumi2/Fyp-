const Maintenance = require("../models/MaintenanceRepairLogs");

// Functions ටික මෙහෙම ලියමු
const addLog = async (req, res) => {
    try {
        const newLog = new Maintenance(req.body);
        await newLog.save();
        res.status(201).json({ message: "Maintenance log added", newLog });
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};

const getAllLogs = async (req, res) => {
    try {
        const logs = await Maintenance.find().sort({ date: -1 });
        res.json(logs);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
};

// 🚀 වැදගත්ම කොටස: මේ විදිහටම export කරන්න
module.exports = {
    addLog,
    getAllLogs
};