const express = require('express');
const router = express.Router();
const tankController = require('../controllers/tankController');

router.get('/', tankController.getAllTanks);
router.post('/:id/salinity', tankController.addSalinity);

module.exports = router;