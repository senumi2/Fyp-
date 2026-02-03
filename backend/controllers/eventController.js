const Event = require("../models/Event");

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new event
const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if(!imageUrl) return res.status(400).json({ message: "Image is required" });

    const newEvent = new Event({ title, description, date, imageUrl });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getEvents, createEvent };
