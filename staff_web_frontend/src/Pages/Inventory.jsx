import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import "./Inventory.css";

const Inventory = () => { 
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false); 
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({ items: '', quantity: '' });

    const fetchInventory = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/inventory?search=${search}`);
            setItems(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error("Failed to load inventory");
        }
    }, [search]);

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
                toast.success("Item updated successfully!");
            } else {
                await axios.post("http://localhost:5000/api/inventory", formData);
                toast.success("Item added successfully!");
            }
            fetchInventory();
            closeModal();
        } catch (err) {
            toast.error("Error saving data");
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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`http://localhost:5000/api/inventory/${id}`);
                toast.success("Item deleted");
                fetchInventory();
            } catch (err) {
                toast.error("Delete failed");
            }
        }
    };

    return (
        <div className="inventory-page-wrapper">
            <Toaster position="top-right" />
            <div className="inventory-container">
                <header className="inventory-header">
                    <div className="title-section">
                        <h2>Equipment Inventory</h2>
                        <p>Track and manage your equipment assets</p>
                    </div>
                    <div className="header-actions">
                        <div className="professional-search">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search inventory..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="main-add-btn" onClick={() => setIsModalOpen(true)}>
                            <span className="plus-icon">+</span> Add New Item
                        </button>
                    </div>
                </header>

                <div className="table-card">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Date Added</th>
                                <th>Item Description</th>
                                <th>Quantity</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? (
                                items.map((item, index) => (
                                    <tr key={item._id}>
                                        <td><span className="index-badge">{index + 1}</span></td>
                                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="item-name-cell">{item.items}</td>
                                        <td>
                                            <span className={`qty-tag ${item.quantity < 5 ? 'low' : ''}`}>
                                                {item.quantity} units
                                            </span>
                                        </td>
                                        <td className="action-cell">
                                            <button className="btn-icon edit" onClick={() => openEditModal(item)} title="Edit">
                                                Edit
                                            </button>
                                            <button className="btn-icon delete" onClick={() => handleDelete(item._id)} title="Delete">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-state">No equipment found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box animated-slide-in">
                        <div className="modal-header">
                            <h3>{isEdit ? "Update Equipment" : "Add New Equipment"}</h3>
                            <button className="close-x" onClick={closeModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Equipment Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Salt Grinder, Shovel" 
                                    value={formData.items}
                                    onChange={(e) => setFormData({...formData, items: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantity Available</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter amount" 
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="primary-btn">{isEdit ? "Save Changes" : "Confirm Add"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;