const Report = require("../models/Report");
const fs = require("fs");
const path = require("path");

// 1. සියලුම වාර්තා ලබා ගැනීම
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports", error: err.message });
  }
};

// 2. නව වාර්තාවක් නිර්මාණය කිරීම (Create)
exports.createReport = async (req, res) => {
  try {
    const { title } = req.body;

    // files පවතිනවාදැයි ඉතා හොඳින් පරීක්ෂා කිරීම
    const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
    const pdfFile = req.files && req.files['pdf'] ? req.files['pdf'][0] : null;

    if (!imageFile || !pdfFile) {
      return res.status(400).json({ message: "Both Image and PDF are required" });
    }

    const imageUrl = `/uploads/${imageFile.filename}`;
    const pdfUrl = `/uploads/${pdfFile.filename}`;

    const newReport = new Report({
      title,
      imageUrl,
      pdfUrl
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    console.error("Create Report Error:", err);
    res.status(500).json({ message: "Error creating report", error: err.message });
  }
};

// 3. වාර්තාවක් යාවත්කාලීන කිරීම (Update)
exports.updateReport = async (req, res) => {
  try {
    const { title } = req.body;
    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // අලුත් ගොනු තිබේ නම් ඒවා ලබා ගැනීම
    const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
    const pdfFile = req.files && req.files['pdf'] ? req.files['pdf'][0] : null;

    const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : report.imageUrl;
    const pdfUrl = pdfFile ? `/uploads/${pdfFile.filename}` : report.pdfUrl;

    report.title = title || report.title;
    report.imageUrl = imageUrl;
    report.pdfUrl = pdfUrl;

    const updatedReport = await report.save();
    res.status(200).json(updatedReport);
  } catch (err) {
    res.status(500).json({ message: "Error updating report", error: err.message });
  }
};

// 4. වාර්තාවක් මකා දැමීම (Delete)
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Files folder එකෙන් ඉවත් කිරීම
    [report.imageUrl, report.pdfUrl].forEach(filePath => {
      if (filePath) {
        const fullPath = path.join(__dirname, "..", filePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    });

    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting report", error: err.message });
  }
};