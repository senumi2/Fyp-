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
        const { subType, transactionType, quantity } = req.body;

        
        const targetName = subType.trim();
        
        
        const safeName = targetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

       
        let product = await Product.findOne({ 
            name: { $regex: new RegExp("^" + safeName + "$", "i") } 
        });

       
        if (!product) {
            product = await Product.findOne({ 
                name: { $regex: new RegExp(safeName, "i") } 
            });
        }

        if (!product) {
            console.error(`❌ DEBUG: Product NOT Found for subType: "${subType}"`);
            return res.status(404).json({ message: "Product not found" });
        }

        console.log(`✅ DEBUG: Target Product Found! Name: ${product.name} | ID: ${product._id}`);
       

        
        const newEntry = new Stock(req.body);
        newEntry.no = await generateRefNo(req.body.itemName, transactionType); 
        await newEntry.save();

        
        const qtyChange = transactionType === 'Inward' ? Number(quantity) : -Number(quantity);
        
        await Product.findByIdAndUpdate(
            product._id,
            { $inc: { stock: qtyChange } },
            { new: true }
        );

        console.log(`✅ SUCCESS: ${product.name} | Stock Updated by: ${qtyChange}`);
        res.status(201).json(newEntry);
    } catch (err) {
        console.error("System Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// 2. Update Stock & Sync Product
exports.updateStock = async (req, res) => {
    try {
        const oldRecord = await Stock.findById(req.params.id);
        if (!oldRecord) return res.status(404).json({ error: "Record not found" });

        const resetQty = oldRecord.transactionType === 'Inward' ? -Number(oldRecord.quantity) : Number(oldRecord.quantity);
        await Product.findOneAndUpdate(
            { name: { $regex: new RegExp("^" + oldRecord.subType.trim() + "$", "i") } }, 
            { $inc: { stock: resetQty } }
        );

        const updated = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });

        const newQty = updated.transactionType === 'Inward' ? Number(updated.quantity) : -Number(updated.quantity);
        await Product.findOneAndUpdate(
            { name: { $regex: new RegExp("^" + updated.subType.trim() + "$", "i") } }, 
            { $inc: { stock: newQty } }
        );

        console.log(`✅ UPDATE SUCCESS: ${updated.subType} Stock Synced`);
        res.status(200).json(updated);
    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// 3. Delete Stock & Reverse Product Sync
exports.deleteStock = async (req, res) => {
    try {
        const record = await Stock.findById(req.params.id);
        if (!record) return res.status(404).json({ error: "Record not found" });

        const reverseQty = record.transactionType === 'Inward' ? -Number(record.quantity) : Number(record.quantity);
        await Product.findOneAndUpdate(
            { name: { $regex: new RegExp("^" + record.subType.trim() + "$", "i") } }, 
            { $inc: { stock: reverseQty } }
        );

        await Stock.findByIdAndDelete(req.params.id);
        console.log(`✅ DELETE SUCCESS: ${record.subType} Stock Reversed`);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err.message);
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