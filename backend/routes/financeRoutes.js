const express = require("express");
const router = express.Router();
const Wage = require("../models/Wage");
const Transport = require("../models/Transport");
const Maintenance = require("../models/MaintenanceRepairLogs");

// Get all wages (Newest first)
router.get("/wages", async (req, res) => {
    try {
        const wages = await Wage.find().sort({ date: -1 });
        res.json(wages);
    } catch (err) { res.status(500).json(err); }
});

// Add new wage
router.post("/wages", async (req, res) => {
    const newWage = new Wage(req.body);
    try {
        const savedWage = await newWage.save();
        res.status(200).json(savedWage);
    } catch (err) { res.status(500).json(err); }
});

// Update wage (Date won't change because we don't send 'date' in body)
router.put("/wages/:id", async (req, res) => {
    try {
        const updatedWage = await Wage.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedWage);
    } catch (err) { res.status(500).json(err); }
});

// Delete wage
router.delete("/wages/:id", async (req, res) => {
    try {
        await Wage.findByIdAndDelete(req.params.id);
        res.status(200).json("Wage deleted");
    } catch (err) { res.status(500).json(err); }
});

// --- Transport Routes ---
router.get("/transport", async (req, res) => {
    const data = await Transport.find().sort({ date: -1 });
    res.json(data);
});

router.post("/transport", async (req, res) => {
    const newItem = new Transport(req.body);
    await newItem.save();
    res.json(newItem);
});

router.put("/transport/:id", async (req, res) => {
    const updated = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

router.delete("/transport/:id", async (req, res) => {
    await Transport.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// --- Maintenance Routes ---
// Get all logs
router.get("/maintenanceRepairLogs", async (req, res) => {
    try {
        const data = await Maintenance.find().sort({ date: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new log
router.post("/maintenanceRepairLogs", async (req, res) => {
    const newItem = new Maintenance(req.body);
    try {
        const newItem = new Maintenance(req.body);
        const savedItem = await newItem.save();
        res.status(200).json(savedItem);
    } catch (err) {
        console.error("❌ Database Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Update log
router.put("/maintenanceRepairLogs/:id", async (req, res) => {
    try {
        const updated = await Maintenance.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete log
router.delete("/maintenanceRepairLogs/:id", async (req, res) => {
    try {
        await Maintenance.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;