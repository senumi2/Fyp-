const Director = require("../models/Director");

exports.createDirector = async (req, res) => {
  try {
    const { name, role, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const director = new Director({
      name,
      role,
      description,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    await director.save();
    res.status(201).json(director);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDirectors = async (req, res) => {
  try {
    const directors = await Director.find().sort({ createdAt: -1 });
    res.json(directors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
