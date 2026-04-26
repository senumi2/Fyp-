const express = require('express');
const router = express.Router();
const tankController = require('../controllers/tankController');

router.get('/', tankController.getAllTanks);
router.post('/', tankController.createTank);
router.post('/:id/salinity', tankController.addSalinity);
router.post('/:id/maintenance', tankController.addMaintenance); 
router.post('/:id/weather', tankController.addOrUpdateWeather);

router.put('/:tankId/salinity/:recordId', tankController.updateSalinityRecord);
router.delete('/:tankId/salinity/:recordId', tankController.deleteSalinityRecord);

module.exports = router;