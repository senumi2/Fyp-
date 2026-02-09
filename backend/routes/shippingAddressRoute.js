const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getShippingAddress,
  saveShippingAddress
} = require("../controllers/shippingAddressController");

router.get("/", auth, getShippingAddress);
router.post("/", auth, saveShippingAddress);

module.exports = router;
