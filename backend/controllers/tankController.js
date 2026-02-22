const Tank = require('../models/Tank');

// Get all tanks
exports.getAllTanks = async (req, res) => {
    try {
        const tanks = await Tank.find();
        res.status(200).json(tanks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add new salinity record
exports.addSalinity = async (req, res) => {
    try {
        const { date, level, process } = req.body;
        const updatedTank = await Tank.findByIdAndUpdate(
            req.params.id,
            { $push: { salinityRecords: { date, level, process } } },
            { new: true }
        );
        res.status(200).json(updatedTank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};