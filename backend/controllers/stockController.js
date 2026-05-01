const Stock = require('../models/Stock');

// --- අලුත්ම Ref No Generator එක ---
const generateRefNo = async (itemName, type) => {
    // එම Item එකට සහ Type එකට අදාළව අවසානයටම ඇතුළත් කළ Record එක සොයනවා
    const lastRecord = await Stock.findOne({ itemName, transactionType: type })
                                  .sort({ createdAt: -1 }); 

    const prefix = type === 'Inward' ? 'IN' : 'OUT';
    const itemPart = itemName.toUpperCase().replace(/\s/g, '');
    
    let nextNumber = 1;

    if (lastRecord && lastRecord.no) {
        // පවතින අංකයෙන් (උදා: "IN-SALT-005") අග කොටස පමණක් වෙන් කරගන්නවා
        const parts = lastRecord.no.split('-');
        const lastSerial = parseInt(parts[parts.length - 1]);
        if (!isNaN(lastSerial)) {
            nextNumber = lastSerial + 1; 
        }
    }

    return `${prefix}-${itemPart}-${nextNumber.toString().padStart(3, '0')}`;
};

// 1. Add Stock
exports.addStock = async (req, res) => {
    try {
        const { itemName, transactionType, quantity } = req.body;

        if (transactionType === 'Outward') {
            const allItems = await Stock.find({ itemName });
            const totalIn = allItems.filter(i => i.transactionType === 'Inward').reduce((sum, i) => sum + i.quantity, 0);
            const totalOut = allItems.filter(i => i.transactionType === 'Outward').reduce((sum, i) => sum + i.quantity, 0);
            const currentStock = totalIn - totalOut;

            if (Number(quantity) > currentStock) {
                return res.status(400).json({ error: `පවතින තොගය ප්‍රමාණවත් නැත! (ඇත්තේ: ${currentStock}kg)` });
            }
        }

        const newEntry = new Stock(req.body);
        newEntry.no = await generateRefNo(itemName, transactionType); // අලුත් logic එකෙන් No එක හදනවා
        
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: "Duplicate Ref No generated. Please try again." });
        }
        res.status(500).json({ error: err.message });
    }
};

// 2. Update Stock
exports.updateStock = async (req, res) => {
    try {
        const record = await Stock.findById(req.params.id);
        if (!record) return res.status(404).json({ error: "Record not found" });

        const today = new Date().toISOString().split('T')[0];
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        if (today !== recordDate) {
            return res.status(403).json({ error: "සංස්කරණය කළ හැක්කේ අද දින දත්ත පමණි." });
        }

        const updated = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Delete Stock
exports.deleteStock = async (req, res) => {
    try {
        const record = await Stock.findById(req.params.id);
        const today = new Date().toISOString().split('T')[0];
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        
        if (today !== recordDate) {
            return res.status(403).json({ error: "මකා දැමිය හැක්කේ අද දින දත්ත පමණි." });
        }

        await Stock.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Get Stocks
exports.getStocks = async (req, res) => {
    try {
        const stocks = await Stock.find().sort({ date: -1, createdAt: -1 }); 
        res.status(200).json(stocks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};