import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "./Inventory.css";

const Inventory = () => { 
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false); 
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({ items: '', quantity: '' });

    // Fetch function eka separate kara
    const fetchInventory = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/inventory?search=${search}`);
            setItems(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    }, [search]);

    // Search trigger wenna
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchInventory();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [fetchInventory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/api/inventory/${selectedId}`, formData);
            } else {
                await axios.post("http://localhost:5000/api/inventory", formData);
            }
            fetchInventory();
            closeModal();
        } catch (err) {
            alert("Error saving data");
        }
    };

    const openEditModal = (item) => {
        setIsEdit(true);
        setSelectedId(item._id);
        setFormData({ items: item.items, quantity: item.quantity });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        setFormData({ items: '', quantity: '' });
    };

    return (
        <div className="page-container">
            <div className="header-row">
                <h2>Manage Equipments</h2>
                <div className="search-container">
                    <span>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search items..." 
                        value={search}
                        /* Mehi onChange eka check karanna */
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            <table className="table-section">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td>{item.items}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <button className="edit-btn" onClick={() => openEditModal(item)}>Edit</button>
                                <button className="delete-btn" onClick={() => {
                                    if(window.confirm("Delete?")) {
                                        axios.delete(`http://localhost:5000/api/inventory/${item._id}`).then(() => fetchInventory());
                                    }
                                }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="button-group">
                <button className="action-btn add-btn" onClick={() => setIsModalOpen(true)}>Add New</button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>{isEdit ? "Update" : "Add New"}</h3>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                placeholder="Item Name" 
                                value={formData.items}
                                onChange={(e) => setFormData({...formData, items: e.target.value})}
                                required
                            />
                            <input 
                                type="number" 
                                placeholder="Quantity" 
                                value={formData.quantity}
                                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                required
                            />
                            <div className="modal-buttons">
                                <button type="submit" className="save-btn">Save</button>
                                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;