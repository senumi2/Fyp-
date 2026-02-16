const Issue = require("../models/Issue");


exports.createIssue = async (req, res) => {
    try {
        const data = await Issue.create(req.body);
        res.status(201).json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};


exports.getIssues = async (req, res) => {
    const { search } = req.query;
    let query = {};

    if (search) {
       
        query.issue = { $regex: search, $options: "i" };
    }

    try {
        const data = await Issue.find(query).sort({ createdAt: -1 });
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};


exports.updateIssue = async (req, res) => {
    try {
        const data = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};


exports.deleteIssue = async (req, res) => {
    try {
        await Issue.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};