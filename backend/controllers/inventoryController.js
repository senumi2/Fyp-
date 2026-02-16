const Inventory = require("../models/Inventory");

// 1. අලුතින් Item එකක් එකතු කිරීම
exports.createInventory = async (req, res) => {
    try {
        const data = await Inventory.create(req.body);
        res.status(201).json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

// 2. දත්ත ලබා ගැනීම සහ Search කිරීම
exports.getInventory = async (req, res) => {
    const { search, all } = req.query;
    let query = {};

    // මාසයක කාල සීමාව ඇතුළත දත්ත පමණක් පෙන්වීමට (all=true නොවේ නම්)
    if (!all) {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        query.createdAt = { $gte: lastMonth };
    }

    // Search logic එක - මෙහිදී field name එක 'items' බවට සහතික කරගන්න
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

// 3. දත්ත Update කිරීම
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

// 4. දත්ත Delete කිරීම
exports.deleteInventory = async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};