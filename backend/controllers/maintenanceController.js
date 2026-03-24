const Maintenance = require("../models/Maintenance");
const MaintenanceLog = require("../models/MaintenanceRepairLogs"); // 🚀 අලුත් Model එකත් මෙතනට ගත්තා

// --- 🔧 පරණ Maintenance Functions (මූලික නඩත්තු සඳහා) ---

exports.createMaintenance = async (req, res) => {
    try {
        const data = await Maintenance.create(req.body);
        res.status(201).json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

exports.getMaintenance = async (req, res) => {
    const { search } = req.query;
    let query = {};
    if (search) {
        query.description = { $regex: search, $options: "i" };
    }
    try {
        const data = await Maintenance.find(query).sort({ createdAt: -1 });
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

exports.updateMaintenance = async (req, res) => {
    try {
        const data = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

exports.deleteMaintenance = async (req, res) => {
    try {
        await Maintenance.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

// --- 📝 අලුත් Maintenance & Repair Logs Functions (ඔයා අලුතින් ඉල්ලපු ඒවා) ---

exports.addLog = async (req, res) => {
    try {
        const newLog = new MaintenanceLog(req.body);
        await newLog.save();
        res.status(201).json({ message: "Maintenance log added", newLog });
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await MaintenanceLog.find().sort({ date: -1 });
        res.json(logs);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
};