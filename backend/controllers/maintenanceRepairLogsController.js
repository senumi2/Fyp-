const Maintenance = require("../models/MaintenanceRepairLogs");

exports.addLog = async (req, res) => {
    try {
        const newLog = new Maintenance(req.body);
        await newLog.save();
        res.status(201).json({ message: "Maintenance log added", newLog });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await Maintenance.find().sort({ date: -1 });
        res.json(logs);
    } catch (err) { res.status(500).json({ message: err.message }); }
};