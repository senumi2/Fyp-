const Inventory = require("../models/Inventory");

// Add new items to inventory
exports.createInventory = async (req, res) => {
    try {
        const data = await Inventory.create(req.body);
        res.status(201).json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

// Search and get data (Fixed Search Logic)
exports.getInventory = async (req, res) => {
    const { search } = req.query;
    let query = {};

    
    if (search && search.trim() !== "") {
        query.items = { $regex: search, $options: "i" };
    }

    try {
        
        const data = await Inventory.find(query).sort({ createdAt: -1 });
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

// Update data
exports.updateInventory = async (req, res) => {
    try {
        const data = await Inventory.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

// Delete data
exports.deleteInventory = async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};