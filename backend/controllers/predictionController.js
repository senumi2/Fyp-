const { spawn } = require('child_process');
const Weather = require('../models/Weather');



exports.getNextDayPrediction = async (req, res) => {
    try {
        // පහුගිය දත්ත 60ක් ලබා ගැනීම (මාසයක දත්ත පමණ)
        const history = await Weather.find().sort({ timestamp: 1 }).limit(100);

        if (history.length < 10) {
            return res.status(400).json({ message: "Insufficient data for prediction" });
        }

        const pythonProcess = spawn('python', ['python/predictorScrit.py']);
        
        let resultData = "";

        // Python එකට දත්ත යැවීම
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
        // පහුගිය දත්ත 150ක් ලබා ගැනීම
        const history = await Weather.find().sort({ timestamp: 1 }).limit(150);

        if (history.length < 20) {
            return res.status(400).json({ message: "Need at least 20 records for weekly analysis" });
        }

        // Python script එක ක්‍රියාත්මක කිරීම
        const pythonProcess = spawn('python', ['python/predictor_weekly.py']);
        
        let resultData = "";

        // Python එකට දත්ත යැවීම
        pythonProcess.stdin.write(JSON.stringify(history));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        // දත්ත කියවා අවසන් වූ පසු JSON ප්‍රතිඵලය ලබා දීම
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

// මාසික සාමාන්‍ය පුරෝකථනය ලබා දෙන Controller එක
exports.getMonthlyAveragePrediction = async (req, res) => {
    try {
        // පහුගිය දත්ත 200ක් පමණ ලබා ගැනීම (මාස 3ක පමණ දත්ත)
        const history = await Weather.find().sort({ timestamp: 1 }).limit(200);

        if (history.length < 30) {
            return res.status(400).json({ message: "Need at least 30 records for monthly analysis" });
        }

        // සතිපතා ස්ක්‍රිප්ට් එකම මෙහිදීද භාවිතා කළ හැක
        const pythonProcess = spawn('python', ['python/predictor_weekly.py']);
        
        let resultData = "";

        // Python එකට දත්ත යැවීම
        pythonProcess.stdin.write(JSON.stringify(history));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        // දත්ත කියවා අවසන් වූ පසු ප්‍රතිඵලය ලබා දීම
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