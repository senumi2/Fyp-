const Stock = require('../models/Stock');

// Helper function to generate Next ID (Internal use only)
const generateRefNo = async (itemName, type) => {
    const count = await Stock.countDocuments({ itemName, transactionType: type });
    const prefix = type === 'Inward' ? 'IN' : 'OUT';
    const itemPart = itemName.toUpperCase().replace(/\s/g, '');
    return `${prefix}-${itemPart}-${(count + 1).toString().padStart(3, '0')}`;
};

// 1. Add Stock with Auto-ID
exports.addStock = async (req, res) => {
    try {
        const { itemName, transactionType, quantity } = req.body;

        // Validation for Outward
        if (transactionType === 'Outward') {
            const allItems = await Stock.find({ itemName });
            const totalIn = allItems.filter(i => i.transactionType === 'Inward').reduce((sum, i) => sum + i.quantity, 0);
            const totalOut = allItems.filter(i => i.transactionType === 'Outward').reduce((sum, i) => sum + i.quantity, 0);
            const currentStock = totalIn - totalOut;

            if (quantity > currentStock) {
                return res.status(400).json({ error: `There is not enough stock! There is only  ${currentStock}kg .` });
            }
        }

        const newEntry = new Stock(req.body);
        // Backend ekenma ID eka hadanawa
        newEntry.no = await generateRefNo(itemName, transactionType);
        
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Update Stock (With Today-Only & Negative Stock Check)
exports.updateStock = async (req, res) => {
    try {
        const record = await Stock.findById(req.params.id);
        if (!record) return res.status(404).json({ error: "Record not found" });

        const today = new Date().toISOString().split('T')[0];
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        if (today !== recordDate) {
            return res.status(403).json({ error: "Only today's data can be edited." });
        }

        // Check if updating this quantity makes the final stock negative
        if (record.transactionType === 'Inward' || req.body.transactionType === 'Outward') {
             const allItems = await Stock.find({ itemName: record.itemName });
             let totalIn = allItems.filter(i => i.transactionType === 'Inward').reduce((sum, i) => sum + i.quantity, 0);
             let totalOut = allItems.filter(i => i.transactionType === 'Outward').reduce((sum, i) => sum + i.quantity, 0);
             
             // Temp adjustment to see future stock
             if (record.transactionType === 'Inward') totalIn = (totalIn - record.quantity) + Number(req.body.quantity);
             else totalOut = (totalOut - record.quantity) + Number(req.body.quantity);

             if (totalIn - totalOut < 0) {
                 return res.status(400).json({ error: "If this change is made,the ending stock will be negative!" });
             }
        }

        const updated = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Delete Stock (With Today-Only)
exports.deleteStock = async (req, res) => {
    try {
        const record = await Stock.findById(req.params.id);
        if (!record) return res.status(404).json({ error: "Record not found" });

        const today = new Date().toISOString().split('T')[0];
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        if (today !== recordDate) {
            return res.status(403).json({ error: "Only today's data can be deleted." });
        }

        await Stock.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
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