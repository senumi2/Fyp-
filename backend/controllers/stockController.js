const Stock = require('../models/Stock');

// නව Stock record එකක් ඇතුළත් කිරීම (With Validation)
exports.addStock = async (req, res) => {
    try {
        const { itemName, transactionType, quantity } = req.body;

        // Validation: පිටතට යන ප්‍රමාණය (Outward) ගබඩාවේ ඇති ප්‍රමාණයට වඩා වැඩිනම් වැළැක්වීම
        if (transactionType === 'Outward') {
            const allItems = await Stock.find({ itemName });
            const totalIn = allItems.filter(i => i.transactionType === 'Inward').reduce((sum, i) => sum + i.quantity, 0);
            const totalOut = allItems.filter(i => i.transactionType === 'Outward').reduce((sum, i) => sum + i.quantity, 0);
            const currentStock = totalIn - totalOut;

            if (quantity > currentStock) {
                return res.status(400).json({ 
                    error: `තොග මදි! දැනට ගබඩාවේ ඇත්තේ ${currentStock}kg පමණි.` 
                });
            }
        }

        const newEntry = new Stock(req.body);
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// සියලුම දත්ත ලබා ගැනීම
exports.getStocks = async (req, res) => {
    try {
        const stocks = await Stock.find().sort({ date: -1 });
        res.status(200).json(stocks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// දත්ත යාවත්කාලීන කිරීම (Route එක වැඩ කිරීමට මෙය තිබිය යුතුය)
exports.updateStock = async (req, res) => {
    try {
        const updated = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// දත්ත මැකීම (Route එක වැඩ කිරීමට මෙය තිබිය යුතුය)
exports.deleteStock = async (req, res) => {
    try {
        await Stock.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};