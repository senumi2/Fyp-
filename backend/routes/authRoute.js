const express = require("express");
const { register, login, getUserProfile, updateAddress } = require("../controllers/authController");

const router = express.Router();
const auth = require('../middleware/authMiddleware');

router.post("/register", register);
router.post("/login", login);

router.get('/profile', auth, getUserProfile); 
router.put('/update-address', auth, updateAddress);

module.exports = router;
