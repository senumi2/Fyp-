const Maintenance = require("../models/MaintenanceRepairLogs");

// 1. අලුත් Log එකක් එකතු කිරීම
const addLog = async (req, res) => {
    try {
        const newLog = new Maintenance(req.body);
        await newLog.save();
        res.status(201).json({ message: "Maintenance log added", newLog });
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};

// 2. සියලුම Logs ලබා ගැනීම (Search පහසුකම සහිතව)
const getAllLogs = async (req, res) => {
    try {
        const { search } = req.query; // Frontend එකෙන් එවන search parameter එක ලබා ගැනීම
        let query = {};

        // සෙවුම් පදයක් තිබේ නම්, එය equipment හෝ issue යන ක්ෂේත්‍ර තුළ සෙවීමට සකස් කිරීම
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

// 3. ලොගයක් Update කිරීම
const updateLog = async (req, res) => {
    try {
        const updatedLog = await Maintenance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedLog) return res.status(404).json({ message: "දත්තය හමු නොවීය" });
        res.status(200).json(updatedLog);
    } catch (error) {
        res.status(500).json({ message: "Update කිරීමේදී දෝෂයක් ඇති විය", error });
    }
};

// 4. ලොගයක් Delete කිරීම
const deleteLog = async (req, res) => {
    try {
        const deletedLog = await Maintenance.findByIdAndDelete(req.params.id);
        if (!deletedLog) return res.status(404).json({ message: "දත්තය හමු නොවීය" });
        res.status(200).json({ message: "සාර්ථකව මකා දැමුවා" });
    } catch (error) {
        res.status(500).json({ message: "මකා දැමීමේදී දෝෂයක් ඇති විය", error });
    }
};

// සියලුම functions එකවර export කිරීම
module.exports = {
    addLog,
    getAllLogs,
    updateLog,
    deleteLog
};