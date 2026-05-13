const { spawn } = require('child_process');
const Weather = require('../models/Weather');



exports.getNextDayPrediction = async (req, res) => {
    try {
        // Retrieving 60 past data (about a month's worth of data)
        const history = await Weather.find().sort({ timestamp: 1 }).limit(100);

        if (history.length < 10) {
            return res.status(400).json({ message: "Insufficient data for prediction" });
        }

        const pythonProcess = spawn('python', ['python/predictorScrit.py']);
        
        let resultData = "";

        
        pythonProcess.stdin.write(JSON.stringify(history));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        pythonProcess.stdout.on('end', () => {
            try {
                const predictions = JSON.parse(resultData);
                res.json(predictions);
            } catch (e) {
                res.status(500).json({ error: "Prediction failed" });
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getWeeklyAveragePrediction = async (req, res) => {
    try {
        // Retrieving past 150 data
        const history = await Weather.find().sort({ timestamp: 1 }).limit(150);

        if (history.length < 20) {
            return res.status(400).json({ message: "Need at least 20 records for weekly analysis" });
        }

       
        const pythonProcess = spawn('python', ['python/predictor_weekly.py']);
        
        let resultData = "";

       
        pythonProcess.stdin.write(JSON.stringify(history));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        
        pythonProcess.stdout.on('end', () => {
            try {
                const predictions = JSON.parse(resultData);
                res.json(predictions);
            } catch (e) {
                res.status(500).json({ error: "Weekly prediction failed" });
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getMonthlyAveragePrediction = async (req, res) => {
    try {
      
        const history = await Weather.find().sort({ timestamp: 1 }).limit(200);

        if (history.length < 30) {
            return res.status(400).json({ message: "Need at least 30 records for monthly analysis" });
        }

        const pythonProcess = spawn('python', ['python/predictor_weekly.py']);
        
        let resultData = "";

        
        pythonProcess.stdin.write(JSON.stringify(history));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        
        pythonProcess.stdout.on('end', () => {
            try {
                const predictions = JSON.parse(resultData);
                res.json(predictions);
            } catch (e) {
                res.status(500).json({ error: "Monthly prediction failed" });
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};