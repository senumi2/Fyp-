const Director = require("../models/Director");

// CREATE
exports.createDirector = async (req, res) => {
  try {
    const { name, role, description } = req.body;

    const director = new Director({
      name,
      role,
      description,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    await director.save();
    res.status(201).json(director);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ
exports.getDirectors = async (req, res) => {
  const directors = await Director.find().sort({ createdAt: -1 });
  res.json(directors);
};

// UPDATE
exports.updateDirector = async (req, res) => {
  try {
    const { name, role, description } = req.body;

    const updateData = { name, role, description };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const director = await Director.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(director);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteDirector = async (req, res) => {
  await Director.findByIdAndDelete(req.params.id);
  res.json({ message: "Director deleted" });
};
