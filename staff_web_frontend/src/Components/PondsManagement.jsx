import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PondsManagement.css';

const PondsManagement = () => {
    const [tanks, setTanks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/tanks')
            .then(res => setTanks(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container">
            {/* Sidebar */}
            <div className="sidebar">
                <button className="nav-btn">Tank details</button>
                <button className="nav-btn">Salinity</button>
                <button className="nav-btn">Weather Tracking</button>
                <button className="nav-btn">Weather Prediction</button>
            </div>

            {/* Content */}
            <div className="main-content">
                {/* Tank Details Section */}
                <div className="section-tank">
                    <h3>Tank Details</h3>
                    <table className="table-style">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Total No. of ponds</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tanks.map(tank => (
                                <tr key={tank._id}>
                                    <td>{tank.type}</td>
                                    <td>{tank.capacity}</td>
                                    <td>{tank.totalPonds}</td>
                                    <td>{tank.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Salinity Section */}
                <div className="section-salinity">
                    <h3>Salinity</h3>
                    {tanks.map((tank, index) => (
                        <div key={tank._id} style={{ marginBottom: '30px' }}>
                            <p><strong>{index + 1}st tanks</strong></p>
                            <table className="table-style">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Salinity</th>
                                        <th>Process</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tank.salinityRecords?.map((rec, i) => (
                                        <tr key={i}>
                                            <td>{new Date(rec.date).toLocaleDateString()}</td>
                                            <td>{rec.level}</td>
                                            <td>{rec.process}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="action-btn">Add</button>
                            <button className="action-btn">Update</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PondsManagement;