const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getEvents, createEvent } = require("../controllers/eventController");

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "uploads/");
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});
const upload = multer({ storage: storage });

// Routes
router.get("/", getEvents);
router.post("/", upload.single("image"), createEvent);

module.exports = router;
