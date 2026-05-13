const Maintenance = require("../models/MaintenanceRepairLogs");


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
        const { search } = req.query;
        let query = {};

        
        if (search) {
            query = {
                $or: [
                    { equipment: { $regex: search, $options: "i" } },
                    { issue: { $regex: search, $options: "i" } }
                ]
            };
        }

        const logs = await Maintenance.find(query).sort({ date: -1 });
        res.json(logs);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
};


const updateLog = async (req, res) => {
    try {
        const updatedLog = await Maintenance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedLog) return res.status(404).json({ message: "Data not found." });
        res.status(200).json(updatedLog);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while updating.", error });
    }
};


const deleteLog = async (req, res) => {
    try {
        const deletedLog = await Maintenance.findByIdAndDelete(req.params.id);
        if (!deletedLog) return res.status(404).json({ message: "Data not found" });
        res.status(200).json({ message: "Deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting.", error });
    }
};


module.exports = {
    addLog,
    getAllLogs,
    updateLog,
    deleteLog
};