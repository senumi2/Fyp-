const express = require("express");
const router = express.Router();
const { getNextDayPrediction , getWeeklyAveragePrediction , getMonthlyAveragePrediction } = require("../controllers/predictionController");



// ඔබ ඉල්ලූ /prediction/nextdayprediction route එකට අනුකූලව:
router.get("/nextdayprediction", getNextDayPrediction);
router.get("/weekly-average", getWeeklyAveragePrediction);
router.get("/monthly-average", getMonthlyAveragePrediction); 

module.exports = router;