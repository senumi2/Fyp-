const Stock = require('../models/Stock');
const Product = require('../models/Product');

// --- Reference Number Generator ---
const generateRefNo = async (itemName, type) => {
    const lastRecord = await Stock.findOne({ itemName, transactionType: type })
                                  .sort({ createdAt: -1 }); 

    const prefix = type === 'Inward' ? 'IN' : 'OUT';
    const itemPart = itemName.toUpperCase().replace(/\s/g, '');
    
    let nextNumber = 1;
    if (lastRecord && lastRecord.no) {
        const parts = lastRecord.no.split('-');
        const lastSerial = parseInt(parts[parts.length - 1]);
        if (!isNaN(lastSerial)) {
            nextNumber = lastSerial + 1; 
        }
    }
    return `${prefix}-${itemPart}-${nextNumber.toString().padStart(3, '0')}`;
};

// 1. Add Stock & Update Product Collection
exports.addStock = async (req, res) => {
    try {
        const { itemName, subType, transactionType, quantity } = req.body;

        const newEntry = new Stock(req.body);
        newEntry.no = await generateRefNo(itemName, transactionType);
        await newEntry.save();

        const qtyChange = transactionType === 'Inward' ? Number(quantity) : -Number(quantity);
        
        // Regex භාවිතා කර අකුරු වල ලොකු කුඩා බව (Case-insensitive) සහ trim කර සෙවීම
        const updatedProduct = await Product.findOneAndUpdate(
            { name: { $regex: new RegExp("^" + subType.trim() + "$", "i") } }, 
            { $inc: { stock: qtyChange } }, 
            { new: true }
        );

        if (!updatedProduct) {
            console.error(`Error: "${subType}" නමින් Product එකක් හමු නොවීය.`);
        }

        res.status(201).json(newEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Update Stock & Sync Product
exports.updateStock = async (req, res) => {
    try {
        const oldRecord = await Stock.findById(req.params.id);
        if (!oldRecord) return res.status(404).json({ error: "Record not found" });

        // පරණ අගය Reset කිරීම (Regex භාවිතයෙන්)
        const resetQty = oldRecord.transactionType === 'Inward' ? -oldRecord.quantity : oldRecord.quantity;
        await Product.findOneAndUpdate(
            { name: { $regex: new RegExp("^" + oldRecord.subType.trim() + "$", "i") } }, 
            { $inc: { stock: resetQty } }
        );

        // අලුත් දත්ත Update කිරීම
        const updated = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // අලුත් අගය Update කිරීම (Regex භාවිතයෙන්)
        const newQty = updated.transactionType === 'Inward' ? updated.quantity : -updated.quantity;
        await Product.findOneAndUpdate(
            { name: { $regex: new RegExp("^" + updated.subType.trim() + "$", "i") } }, 
            { $inc: { stock: newQty } }
        );

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Delete Stock & Reverse Product Sync
exports.deleteStock = async (req, res) => {
    try {
        const record = await Stock.findById(req.params.id);
        if (!record) return res.status(404).json({ error: "Record not found" });

        // මකා දමන වාර්තාව නිසා වෙනස් වූ තොගය නිවැරදි කිරීම (Regex භාවිතයෙන්)
        const reverseQty = record.transactionType === 'Inward' ? -record.quantity : record.quantity;
        await Product.findOneAndUpdate(
            { name: { $regex: new RegExp("^" + record.subType.trim() + "$", "i") } }, 
            { $inc: { stock: reverseQty } }
        );

        await Stock.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Get All Stocks
exports.getStocks = async (req, res) => {
    try {
        const stocks = await Stock.find().sort({ date: -1, createdAt: -1 }); 
        res.status(200).json(stocks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};