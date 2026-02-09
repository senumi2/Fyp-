const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const { getProfile, updateProfile } = require("../controllers/profileController");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage });


router.get("/", auth, getProfile);
router.put("/", auth, upload.single("image"), updateProfile);

module.exports = router;
