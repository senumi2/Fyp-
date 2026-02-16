import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Maintenance.css';

const Maintenance = () => {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({ description: '', status: 'Scheduled' });

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/maintenance?search=${search}`);
                setLogs(res.data);
            } catch (err) { console.error(err); }
        };
        fetchLogs();
    }, [search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/api/maintenance/${selectedId}`, formData);
            } else {
                await axios.post("http://localhost:5000/api/maintenance", formData);
            }
            const res = await axios.get(`http://localhost:5000/api/maintenance?search=${search}`);
            setLogs(res.data);
            closeModal();
        } catch (err) { alert("Error saving maintenance log"); }
    };

    const openEditModal = (item) => {
        setIsEdit(true);
        setSelectedId(item._id);
        setFormData({ description: item.description, status: item.status });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        setFormData({ description: '', status: 'Scheduled' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this log?")) {
            await axios.delete(`http://localhost:5000/api/maintenance/${id}`);
            setLogs(logs.filter(l => l._id !== id));
        }
    };

    return (
        <div className="page-container" style={{ backgroundColor: '#264653', color: 'white' }}>
            <div className="header-row">
                <h2>Maintenance Logs</h2>
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search logs..." 
                        style={{ color: 'black' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>
            </div>

            <table className="table-section" style={{ color: 'black' }}>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((item, index) => (
                        <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td>{item.description}</td>
                            <td>{item.status}</td>
                            <td>
                                <button className="edit-icon-btn" onClick={() => openEditModal(item)}>✏️</button>
                                <button className="delete-icon-btn" onClick={() => handleDelete(item._id)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="button-group">
                <button className="action-btn add-btn" onClick={() => setIsModalOpen(true)}>Add Maintenance Log</button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box" style={{ color: 'black' }}>
                        <h3>{isEdit ? "Update Log" : "New Maintenance Log"}</h3>
                        <form onSubmit={handleSubmit}>
                            <textarea 
                                placeholder="Service details..." 
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                            <select 
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <div className="modal-buttons">
                                <button type="submit" className="save-btn">{isEdit ? "Update" : "Save"}</button>
                                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Maintenance;