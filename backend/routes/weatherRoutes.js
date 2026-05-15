const express = require('express');
const router = express.Router();
const axios = require('axios');
const Weather = require('../models/Weather');
const cron = require('node-cron');

const API_KEY = '9e4e711afbb1d681576b13273c7a0d5e';
const CITY = 'Hambantota'; 


const fetchAndSaveWeather = async (type = 'Scheduled') => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`;
        const response = await axios.get(url);
        const data = response.data;

        const newWeather = new Weather({
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            windDirection: data.wind.deg,
            pressure: data.main.pressure,
            cloudCover: data.clouds.all,
            rainfall: data.rain ? data.rain['1h'] || 0 : 0,
            type: type
        });

        await newWeather.save();
        console.log(`Weather data saved successfully at ${new Date()} (${type})`);
        return newWeather;
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
};

// 1. Scheduler: To work at 9:00 AM and 3:00 PM
cron.schedule('0 9,15 * * *', () => {
    fetchAndSaveWeather('Scheduled');
});

// 2. Manual Entry: The API to work when the button is clicked
router.post('/fetch-now', async (req, res) => {
    const data = await fetchAndSaveWeather('Manual');
    if (data) res.status(200).json(data);
    else res.status(500).json({ error: "Failed to fetch data" });
});

module.exports = router;