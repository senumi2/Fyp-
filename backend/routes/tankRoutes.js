const express = require('express');
const router = express.Router();
const tankController = require('../controllers/tankController');

router.get('/', tankController.getAllTanks);
router.post('/', tankController.createTank);
router.post('/:id/salinity', tankController.addSalinity);
router.post('/:id/maintenance', tankController.addMaintenance); // නව route එක
router.post('/:id/weather', tankController.addOrUpdateWeather);

module.exports = router;