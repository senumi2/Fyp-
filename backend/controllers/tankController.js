const Tank = require('../models/Tank');

// 1. Get all tanks
exports.getAllTanks = async (req, res) => {
    try {
        const tanks = await Tank.find();
        res.status(200).json(tanks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Create a new Tank
exports.createTank = async (req, res) => {
    try {
        const newTank = new Tank(req.body);
        const savedTank = await newTank.save();
        res.status(201).json(savedTank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 3. Add or Update Salinity Record with Status Logic
exports.addSalinity = async (req, res) => {
    try {
        const { level, process } = req.body;
        const tankId = req.params.id;

        // Auto Status Logic based on Baumé scale (Be')
        let status = 'Stable';
        if (level >= 24) status = 'Ready to Move';
        if (level > 28) status = 'High';

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const tank = await Tank.findById(tankId);
        if (!tank) return res.status(404).json({ message: "Tank not found" });

        const todayRecordIndex = tank.salinityRecords.findIndex(r => r.date >= startOfToday && r.date <= endOfToday);

        if (todayRecordIndex > -1) {
            tank.salinityRecords[todayRecordIndex].level = level;
            tank.salinityRecords[todayRecordIndex].process = process;
            tank.salinityRecords[todayRecordIndex].status = status;
        } else {
            tank.salinityRecords.push({ level, process, status });
        }

        tank.currentSalinity = level;
        await tank.save();
        res.status(200).json(tank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 4. Add Maintenance Log
exports.addMaintenance = async (req, res) => {
    try {
        const { task, performedBy, description } = req.body;
        const tank = await Tank.findByIdAndUpdate(
            req.params.id,
            { $push: { maintenanceLogs: { task, performedBy, description } } },
            { new: true }
        );
        res.status(200).json(tank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 5. Add or Update Weather
exports.addOrUpdateWeather = async (req, res) => {
    try {
        const { status } = req.body;
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const tank = await Tank.findOne({ _id: req.params.id, "weatherRecords.date": { $gte: startOfToday, $lte: endOfToday } });

        let updated;
        if (tank) {
            updated = await Tank.findOneAndUpdate(
                { _id: req.params.id, "weatherRecords.date": { $gte: startOfToday, $lte: endOfToday } },
                { $set: { "weatherRecords.$.status": status } },
                { new: true }
            );
        } else {
            updated = await Tank.findByIdAndUpdate(req.params.id, { $push: { weatherRecords: { date: new Date(), status } } }, { new: true });
        }
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};