const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const reportController = require("../controllers/reportController");
const auth = require("../middleware/authMiddleware"); 


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


router.post(
  "/", 
  auth, 
  auth.admin, 
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]), 
  reportController.createReport
);

router.put(
  "/:id", 
  auth, 
  auth.admin, 
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]), 
  reportController.updateReport
);

router.delete("/:id", auth, auth.admin, reportController.deleteReport);

module.exports = router;