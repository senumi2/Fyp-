import React, { useState } from 'react';
import axios from 'axios';
import './WeatherDashboard.css';

const WeatherDashboard = () => {
    const [predictionType, setPredictionType] = useState('next-day');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    const predictionRoutes = {
        'next-day': '/api/prediction/nextdayprediction',
        'weekly': '/api/prediction/weekly-average',
        'monthly': '/api/prediction/monthly-average'
    };

    // අනාවැකිය ලබා ගැනීම
    const fetchPrediction = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000${predictionRoutes[predictionType]}`);
            setData(res.data);
            setStatusMsg("");
        } catch (err) {
            setStatusMsg("Error fetching prediction data.");
        }
        setLoading(false);
    };

    // වර්තමාන දත්ත ලබාගෙන සේව් කිරීම (Manual Fetch)
    const handleManualFetch = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/weather/fetch-now');
            setStatusMsg("Current weather saved to database!");
        } catch (err) {
            setStatusMsg("Error saving current weather.");
        }
        setLoading(false);
    };

    // Frontend Logic: දත්ත අනුව නිගමනයක් ලබා දීම
    const getConclusion = (d) => {
        if (!d) return "";
        let advice = "";
        
        if (d.rainfall > 2) {
            advice = "වැසි සහිත කාලගුණයක් පවතින බැවින් ලුණු අස්වනු නෙලීමෙන් වලකින්න. ලුණු ලේවායන් ආවරණය කිරීමට පියවර ගන්න.";
        } else if (d.temperature > 30 && d.humidity < 60) {
            advice = "ලුණු නිෂ්පාදනයට ඉතා හිතකර කාලගුණයකි. වාෂ්පීකරණ වේගය ඉහළ බැවින් ක්‍රියාවලිය වේගවත් කළ හැක.";
        } else if (d.windSpeed > 8) {
            advice = "තද සුළං පවතින බැවින් ජලය පොම්ප කිරීමේදී සහ නඩත්තු කටයුතු වලදී ප්‍රවේශම් වන්න.";
        } else {
            advice = "සාමාන්‍ය කාලගුණික තත්ත්වයක් පවතී. නියමිත කාලසටහනට අනුව කටයුතු කරගෙන යන්න.";
        }
        return advice;
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Saltern Weather Intelligence</h2>
                <div className="controls">
                    <select 
                        className="dropdown" 
                        value={predictionType} 
                        onChange={(e) => setPredictionType(e.target.value)}
                    >
                        <option value="next-day">Next Day Prediction</option>
                        <option value="weekly">Weekly Average</option>
                        <option value="monthly">Monthly Average</option>
                    </select>
                    <button className="btn btn-predict" onClick={fetchPrediction} disabled={loading}>
                        {loading ? "Processing..." : "Show Prediction"}
                    </button>
                    <button className="btn btn-now" onClick={handleManualFetch}>
                        Record Current Weather
                    </button>
                </div>
            </header>

            {statusMsg && <div className="status-banner">{statusMsg}</div>}

            {data && (
                <main className="dashboard-content">
                    <div className="conclusion-box">
                        <h4>නිගමනය සහ උපදෙස් (Conclusion)</h4>
                        <p>{getConclusion(data)}</p>
                    </div>

                    <div className="stats-grid">
                        <StatCard label="Temperature" value={`${data.temperature} °C`} icon="🌡️" />
                        <StatCard label="Humidity" value={`${data.humidity} %`} icon="💧" />
                        <StatCard label="Wind Speed" value={`${data.windSpeed} m/s`} icon="💨" />
                        <StatCard label="Pressure" value={`${data.pressure} hPa`} icon="⏲️" />
                        <StatCard label="Cloud Cover" value={`${data.cloudCover} %`} icon="☁️" />
                        <StatCard label="Rainfall" value={`${data.rainfall} mm`} icon="🌧️" />
                    </div>
                </main>
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon }) => (
    <div className="stat-card">
        <span className="icon">{icon}</span>
        <div className="stat-info">
            <label>{label}</label>
            <h3>{value}</h3>
        </div>
    </div>
);

export default WeatherDashboard;