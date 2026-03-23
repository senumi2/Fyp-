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
        const newTank = new Tank({
            type: req.body.type,
            capacity: req.body.capacity,
            totalPonds: req.body.totalPonds,
            location: req.body.location,
            salinityRecords: [],
            weatherRecords: []
        });
        const savedTank = await newTank.save();
        res.status(201).json(savedTank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 3. Add or Update Salinity Record (FOR TODAY ONLY)
exports.addSalinity = async (req, res) => {
    try {
        const { level, process } = req.body;
        const tankId = req.params.id;

        // අද දවසේ ආරම්භය සහ අවසානය සකස් කිරීම
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // අද දිනයට අදාළ record එකක් තිබේදැයි බැලීම
        const tank = await Tank.findOne({
            _id: tankId,
            "salinityRecords.date": { $gte: startOfToday, $lte: endOfToday }
        });

        let updatedTank;

        if (tank) {
            // අද දවසේ record එකක් තිබේ නම්, එය UPDATE කිරීම
            updatedTank = await Tank.findOneAndUpdate(
                { 
                    _id: tankId, 
                    "salinityRecords.date": { $gte: startOfToday, $lte: endOfToday } 
                },
                { 
                    $set: { 
                        "salinityRecords.$.level": level, 
                        "salinityRecords.$.process": process 
                    } 
                },
                { new: true }
            );
        } else {
            // අද දවසේ record එකක් නැත්නම්, අලුතින් ඇතුළත් (PUSH) කිරීම
            updatedTank = await Tank.findByIdAndUpdate(
                tankId,
                { 
                    $push: { 
                        salinityRecords: { 
                            date: new Date(), // Automatic Current Date
                            level, 
                            process 
                        } 
                    } 
                },
                { new: true }
            );
        }

        res.status(200).json(updatedTank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 4. Update existing salinity record (සාමාන්‍ය update එකක් අවශ්‍ය නම් පමණක්)
exports.updateSalinity = async (req, res) => {
    try {
        const { tankId, recordId } = req.params;
        const { level, process } = req.body;

        const updatedTank = await Tank.findOneAndUpdate(
            { _id: tankId, "salinityRecords._id": recordId },
            { 
                $set: { 
                    "salinityRecords.$.level": level, 
                    "salinityRecords.$.process": process 
                } 
            },
            { new: true }
        );
        res.status(200).json(updatedTank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Add or Update Weather for TODAY only
exports.addOrUpdateWeather = async (req, res) => {
    try {
        const { status } = req.body; // Weather status (Rainy, Sunny, etc.)
        const tankId = req.params.id;

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const tank = await Tank.findOne({
            _id: tankId,
            "weatherRecords.date": { $gte: startOfToday, $lte: endOfToday }
        });

        let updatedTank;
        if (tank) {
            // අද දිනට තිබේ නම් Update කරන්න
            updatedTank = await Tank.findOneAndUpdate(
                { _id: tankId, "weatherRecords.date": { $gte: startOfToday, $lte: endOfToday } },
                { $set: { "weatherRecords.$.status": status } },
                { new: true }
            );
        } else {
            // නැතිනම් අලුතින් ඇතුළත් කරන්න
            updatedTank = await Tank.findByIdAndUpdate(
                tankId,
                { $push: { weatherRecords: { date: new Date(), status } } },
                { new: true }
            );
        }
        res.status(200).json(updatedTank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};