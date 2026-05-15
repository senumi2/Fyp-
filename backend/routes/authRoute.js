const express = require("express");

const { 
  register, 
  login, 
  getUserProfile, 
  updateAddress, 
  getAllDrivers, 
  getPendingUsers, 
  approveUser     
} = require("../controllers/authController");

const router = express.Router();
const auth = require('../middleware/authMiddleware');


router.post("/register", register);
router.post("/login", login);


router.get('/profile', auth, getUserProfile); 
router.get('/drivers', auth, getAllDrivers);
router.put('/update-address', auth, updateAddress);


router.get('/pending-users', auth, auth.admin, getPendingUsers);
router.put('/approve-user/:id', auth, auth.admin, approveUser);

module.exports = router;