// tankRoutes.js
const express = require('express');
const router = express.Router();
const tankController = require('../controllers/tankController');

// පවතින functions (කිසිවක් වෙනස් කර නැත)
router.get('/', tankController.getAllTanks);
router.post('/', tankController.createTank);
router.post('/:id/salinity', tankController.addSalinity);
router.post('/:id/maintenance', tankController.addMaintenance); 
router.post('/:id/weather', tankController.addOrUpdateWeather);

router.put('/:tankId/salinity/:recordId', tankController.updateSalinityRecord);
router.delete('/:tankId/salinity/:recordId', tankController.deleteSalinityRecord);
router.put('/:tankId/maintenance/:logId', tankController.updateMaintenance);

// Update tank basic info
router.put('/:id', tankController.updateTank);

// නව Delete route එක (මෙය තිබිය යුත්තේ අගටය)
router.delete('/:id', tankController.deleteTank);

module.exports = router;