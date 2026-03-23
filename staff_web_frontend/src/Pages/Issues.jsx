import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Issues.css';

const Issues = () => {
    const [issues, setIssues] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({ issue: '', status: 'Pending' });

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/issues?search=${search}`);
                setIssues(res.data);
            } catch (err) { console.error(err); }
        };
        fetchIssues();
    }, [search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/api/issues/${selectedId}`, formData);
            } else {
                await axios.post("http://localhost:5000/api/issues", formData);
            }
            const res = await axios.get(`http://localhost:5000/api/issues?search=${search}`);
            setIssues(res.data);
            closeModal();
        } catch (err) { alert("Error saving issue"); }
    };

    const openEditModal = (item) => {
        setIsEdit(true);
        setSelectedId(item._id);
        setFormData({ issue: item.issue, status: item.status });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        setFormData({ issue: '', status: 'Pending' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this issue?")) {
            await axios.delete(`http://localhost:5000/api/issues/${id}`);
            setIssues(issues.filter(i => i._id !== id));
        }
    };

    return (
        <div className="page-container" style={{ backgroundColor: '#99A8AA' }}>
            <div className="header-row">
                <h2>Reported Issues</h2>
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search issues..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>
            </div>

            <table className="table-section">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Date</th>
                        <th>Issue Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {issues.map((item, index) => (
                        <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td>{item.issue}</td>
                            <td>{item.status}</td>
                            <td>
                                <button className="edit-btn" onClick={() => openEditModal(item)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="button-group">
                <button className="action-btn add-btn" onClick={() => setIsModalOpen(true)}>Report New Issue</button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>{isEdit ? "Update Issue" : "Report Issue"}</h3>
                        <form onSubmit={handleSubmit}>
                            <textarea 
                                placeholder="Describe the issue..." 
                                required
                                value={formData.issue}
                                onChange={(e) => setFormData({...formData, issue: e.target.value})}
                            />
                            <select 
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Fixed">Fixed</option>
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

export default Issues;