const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createDirector,
  getDirectors,
  updateDirector,
  deleteDirector
} = require("../controllers/directorController");


//  PUBLIC (User + Admin)
router.get("/", getDirectors);

//  ADMIN ONLY
router.post("/", auth, admin, upload.single("image"), createDirector);
router.put("/:id", auth, admin, upload.single("image"), updateDirector);
router.delete("/:id", auth, admin, deleteDirector);

module.exports = router;
