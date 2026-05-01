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

// 3. Add or Update Salinity Record
exports.addSalinity = async (req, res) => {
    try {
        const { level, process } = req.body;
        const tankId = req.params.id;

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

// 4. Add Maintenance Log (Updated: End Date optional)
exports.addMaintenance = async (req, res) => {
    try {
        const { task, startDate, endDate, description } = req.body;
        const tank = await Tank.findByIdAndUpdate(
            req.params.id,
            { 
                $push: { 
                    maintenanceLogs: { 
                        task, 
                        startDate, 
                        endDate: endDate || "Pending", 
                        description: description || "" 
                    } 
                } 
            },
            { new: true }
        );
        res.status(200).json(tank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 5. Update Maintenance Log (New: To set end date later)
exports.updateMaintenance = async (req, res) => {
    try {
        const { tankId, logId } = req.params;
        const { endDate } = req.body;

        const tank = await Tank.findOneAndUpdate(
            { _id: tankId, "maintenanceLogs._id": logId },
            { $set: { "maintenanceLogs.$.endDate": endDate } },
            { new: true }
        );

        if (!tank) return res.status(404).json({ message: "Log not found" });
        res.status(200).json(tank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete Today's Salinity Record
exports.deleteSalinityRecord = async (req, res) => {
    try {
        const { tankId, recordId } = req.params;
        const tank = await Tank.findById(tankId);
        const record = tank.salinityRecords.id(recordId);
        
        if (new Date(record.date).toDateString() !== new Date().toDateString()) {
            return res.status(403).json({ message: "Only today's records can be deleted." });
        }

        tank.salinityRecords.pull(recordId);
        const lastRecord = tank.salinityRecords[tank.salinityRecords.length - 1];
        tank.currentSalinity = lastRecord ? lastRecord.level : 0;

        await tank.save();
        res.status(200).json(tank);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Today's Salinity Record
exports.updateSalinityRecord = async (req, res) => {
    try {
        const { tankId, recordId } = req.params;
        const { level } = req.body;
        
        const tank = await Tank.findById(tankId);
        const record = tank.salinityRecords.id(recordId);
        
        if (new Date(record.date).toDateString() !== new Date().toDateString()) {
            return res.status(403).json({ message: "Only today's records can be edited." });
        }

        record.level = level;
        let status = 'Stable';
        if (level >= 24) status = 'Ready to Move';
        if (level > 28) status = 'High';
        record.status = status;
        
        tank.currentSalinity = level;
        await tank.save();
        res.status(200).json(tank);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add or Update Weather
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

// Update basic tank details (Type, Capacity, Location, etc.)
exports.updateTank = async (req, res) => {
    try {
        const updatedTank = await Tank.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );

        if (!updatedTank) {
            return res.status(404).json({ message: "Tank not found to update." });
        }
        res.status(200).json(updatedTank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a specific tank
// tankController.js හි අවසානයට එකතු කරන්න

exports.deleteTank = async (req, res) => {
    try {
        const { id } = req.params;
        
        // ටැංකිය සොයා මකා දැමීම
        const tank = await Tank.findByIdAndDelete(id);
        
        if (!tank) {
            // ID එක database එකේ නැති විට 404 පණිවිඩය ලබා දෙයි
            return res.status(404).json({ message: "Tank not found in Database." });
        }
        
        res.status(200).json({ message: "Tank deleted successfully from National Salt system." });
    } catch (err) {
        // ID එකේ format එක වැරදි නම් (CastError) 400 status එක ලබා දෙයි
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid Tank ID format." });
        }
        res.status(500).json({ message: "Server error: " + err.message });
    }
};