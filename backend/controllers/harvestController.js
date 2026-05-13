const Harvest = require('../models/Harvest');


exports.getAllHarvests = async (req, res) => {
    try {
        const harvests = await Harvest.find();
        res.status(200).json(harvests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new record(POST)
exports.addHarvestRecord = async (req, res) => {
    const { category, type, quantity } = req.body;

    try {
        
        const newEntry = {
            type: type,
            quantity: Number(quantity),
            date: new Date()
        };

        
        const updatedHarvest = await Harvest.findOneAndUpdate(
            { category: category },
            { $push: { records: newEntry } },
            { upsert: true, new: true, runValidators: true }
        );

        const allData = await Harvest.find();
        res.status(200).json(allData);
    } catch (err) {
        console.error("Validation Error Details:", err.errors); 
        res.status(400).json({ message: "Add failed: " + err.message });
    }
};


exports.updateHarvestRecord = async (req, res) => {
    const { category, recordId } = req.params;
    const { type, quantity } = req.body;

    try {
        
        const updatedHarvest = await Harvest.findOneAndUpdate(
            { category, "records._id": recordId },
            {
                $set: {
                    "records.$.type": type,
                    "records.$.quantity": Number(quantity)
                }
            },
            { new: true }
        );

        if (!updatedHarvest) {
            return res.status(404).json({ message: "Record not found" });
        }

        const allData = await Harvest.find();
        res.status(200).json(allData);
    } catch (err) {
        res.status(400).json({ message: "Update failed: " + err.message });
    }
};


exports.deleteHarvestRecord = async (req, res) => {
    const { category, recordId } = req.params;

    try {
        const updatedHarvest = await Harvest.findOneAndUpdate(
            { category },
            { $pull: { records: { _id: recordId } } },
            { new: true }
        );

        const allData = await Harvest.find();
        res.status(200).json(allData);
    } catch (err) {
        res.status(400).json({ message: "Delete failed: " + err.message });
    }
};