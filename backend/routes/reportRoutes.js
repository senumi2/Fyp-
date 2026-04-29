const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const reportController = require("../controllers/reportController");
const auth = require("../middleware/authMiddleware"); 

// Multer Storage Configuration (පවතින පරිදිමයි)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// --- ROUTES ---

router.get("/", reportController.getAllReports);

// ✅ POST සහ PUT වලට auth සහ auth.admin යන දෙකම එක් කරන්න
router.post(
  "/", 
  auth, 
  auth.admin, // මෙන්න මේ පේළිය අනිවාර්යයි
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]), 
  reportController.createReport
);

router.put(
  "/:id", 
  auth, 
  auth.admin, // මෙන්න මේ පේළිය අනිවාර්යයි
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]), 
  reportController.updateReport
);

router.delete("/:id", auth, auth.admin, reportController.deleteReport);

module.exports = router;