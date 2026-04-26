const express = require("express");
// මෙතන කලින් පේළි දෙකක් තිබුණා, ඒක එකකට ලුහුඬු කළා
const { 
  register, 
  login, 
  getUserProfile, 
  updateAddress, 
  getAllDrivers, 
  getPendingUsers, // අලුතින් එකතු කළ ඒවා
  approveUser      // අලුතින් එකතු කළ ඒවා
} = require("../controllers/authController");

const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes (ලොග් වුණු අයට පමණයි)
router.get('/profile', auth, getUserProfile); 
router.get('/drivers', auth, getAllDrivers);
router.put('/update-address', auth, updateAddress);

// Admin Routes (Admin Approval පද්ධතිය සඳහා)
// මෙහි auth.adminMiddleware ලෙස ඇත්තේ ඔබේ middleware එකේ නම අනුවයි
router.get('/pending-users', auth, auth.admin, getPendingUsers);
router.put('/approve-user/:id', auth, auth.admin, approveUser);

module.exports = router;