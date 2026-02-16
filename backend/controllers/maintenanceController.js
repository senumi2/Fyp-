const Maintenance = require("../models/Maintenance");

// 1. Kotha Maintenance Log ni create cheyyadam
exports.createMaintenance = async (req, res) => {
    try {
        const data = await Maintenance.create(req.body);
        res.status(201).json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

// 2. Data ni get cheyyadam mariyu Search cheyyadam
exports.getMaintenance = async (req, res) => {
    const { search } = req.query;
    let query = {};

    if (search) {
        // 'description' ane field lo search cheyadaniki
        query.description = { $regex: search, $options: "i" };
    }

    try {
        const data = await Maintenance.find(query).sort({ createdAt: -1 });
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

// 3. Data ni update cheyyadam
exports.updateMaintenance = async (req, res) => {
    try {
        const data = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

// 4. Data ni delete cheyyadam
exports.deleteMaintenance = async (req, res) => {
    try {
        await Maintenance.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};