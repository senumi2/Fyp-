import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Inventory.css";

const Inventory = () => { // <--- Component එක මෙතනින් පටන් ගත යුතුයි
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false); 
    const [selectedId, setSelectedId] = useState(null);
    
    const [formData, setFormData] = useState({ items: '', quantity: '' });

    // 1. Fetch & Search Logic
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/inventory?search=${search}`);
                setItems(res.data);
            } catch (err) {
                console.error("Search Error:", err);
            }
        };
        fetchInventory();
    }, [search]); 

    // 2. Add or Update Logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/api/inventory/${selectedId}`, formData);
            } else {
                await axios.post("http://localhost:5000/api/inventory", formData);
            }
            
            const res = await axios.get(`http://localhost:5000/api/inventory?search=${search}`);
            setItems(res.data);
            closeModal();
        } catch (err) {
            alert("Error saving data");
        }
    };

    // 3. Edit Modal open logic
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
        if (window.confirm("Delete this item?")) {
            await axios.delete(`http://localhost:5000/api/inventory/${id}`);
            setItems(items.filter(item => item._id !== id));
        }
    };

    return (
        <div className="page-container" style={{ backgroundColor: '#A3B18A' }}>
            <div className="header-row">
                <h2>Manage Equipments</h2>
                <div className="search-container">
                    <span>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Type item name to search..." 
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
                                <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
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
                        <h3>{isEdit ? "Update Equipment" : "Add New Equipment"}</h3>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                placeholder="Item Name" 
                                required
                                value={formData.items}
                                onChange={(e) => setFormData({...formData, items: e.target.value})}
                            />
                            <input 
                                type="number" 
                                placeholder="Quantity" 
                                required
                                value={formData.quantity}
                                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                            />
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

export default Inventory;