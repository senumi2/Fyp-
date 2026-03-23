const Harvest = require('../models/Harvest');

// සියලුම Harvest දත්ත ලබා ගැනීම
exports.getAllHarvests = async (req, res) => {
    try {
        const harvests = await Harvest.find();
        res.status(200).json(harvests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// අද දිනට අලුත් පේළියක් එකතු කිරීම හෝ Update කිරීම
exports.addHarvestRecord = async (req, res) => {
    try {
        const { category, type, quantity } = req.body;
        let harvest = await Harvest.findOne({ category });

        if (!harvest) {
            harvest = new Harvest({ category, records: [] });
        }

        // අද දිනට අලුත් record එකක් ඇතුළත් කිරීම
        harvest.records.push({ 
            type, 
            quantity: Number(quantity), 
            date: new Date() 
        });
        
        await harvest.save();
        
        // අලුත් දත්ත ඇතුළත් වූ පසු සියලුම දත්ත නැවත ලබා ගැනීම (Frontend table update එක සඳහා)
        const updatedHarvests = await Harvest.find();
        res.status(200).json(updatedHarvests);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};