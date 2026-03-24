const Transport = require("../models/Transport");

exports.addTransport = async (req, res) => {
    try {
        const newTransport = new Transport(req.body);
        await newTransport.save();
        res.status(201).json({ message: "Transport log added", newTransport });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getAllTransports = async (req, res) => {
    try {
        const logs = await Transport.find().sort({ date: -1 });
        res.json(logs);
    } catch (err) { res.status(500).json({ message: err.message }); }
};  