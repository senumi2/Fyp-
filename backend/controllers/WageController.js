const Wage = require("../models/Wage");

exports.addWage = async (req, res) => {
    try {
        const newWage = new Wage(req.body);
        await newWage.save();
        res.status(201).json({ message: "Wage added successfully", newWage });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getAllWages = async (req, res) => {
    try {
        const wages = await Wage.find().sort({ date: -1 });
        res.json(wages);
    } catch (err) { res.status(500).json({ message: err.message }); }
};