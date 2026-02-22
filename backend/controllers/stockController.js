const Stock = require('../models/Stock');


exports.addStock = async (req, res) => {
    try {
        const newEntry = new Stock(req.body);
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getStocks = async (req, res) => {
    try {
        const stocks = await Stock.find().sort({ date: -1 });
        res.status(200).json(stocks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateStock = async (req, res) => {
    try {
        const updated = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};