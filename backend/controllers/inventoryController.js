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

//  search and get data
exports.getInventory = async (req, res) => {
    const { search, all } = req.query;
    let query = {};

    // show data within only month (if not all=true)
    if (!all) {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        query.createdAt = { $gte: lastMonth };
    }

   
    if (search) {
        query.items = { $regex: search, $options: "i" };
    }

    try {
        const data = await Inventory.find(query).sort({ createdAt: -1 });
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

// update dat
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

// delete data
exports.deleteInventory = async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};