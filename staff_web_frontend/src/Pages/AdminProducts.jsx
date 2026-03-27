import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./AdminProducts.css";

function AdminProducts() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    details: "",
    image: null,
  });

  // Fetch products and sync auto-calculated stock from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("details", form.details);
    if (form.image) data.append("image", form.image);

    const url = editingId 
      ? `http://localhost:5000/api/products/${editingId}` 
      : "http://localhost:5000/api/products";
    
    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });

    setForm({ name: "", price: "", details: "", image: null });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      price: p.price,
      details: p.details,
      image: null
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    }
  };

  return (
    <div className="admin-products-page">
      <div className="content-wrapper">
        
        {/* Header Section with Compact Stats */}
        <header className="admin-header-row">
          <div className="glass-header">
            <h1>Saltern Product Hub</h1>
            <p>Monitor real-time inventory and salt varieties</p>
          </div>
          
          <div className="stats-mini-pill">
            <div className="pill-icon">📦</div>
            <div className="pill-info">
              <span className="pill-label">Total Varieties</span>
              <span className="pill-val">{products.length}</span>
            </div>
          </div>
        </header>

        {/* Management Form Card */}
        <section className="management-section">
          <div className="management-card">
            <div className="card-header-flex">
               <h3 className="form-title">{editingId ? "Update Product Details" : "Register New Product"}</h3>
               {editingId && (
                 <button className="cancel-pill" onClick={() => {setEditingId(null); setForm({name:"", price:"", details:"", image:null})}}>
                   Exit Edit Mode
                 </button>
               )}
            </div>
            
            <form className="modern-form" onSubmit={handleSubmit}>
              <div className="input-row">
                <div className="input-group">
                  <label>Product Name</label>
                  <input type="text" placeholder="e.g. Refined Table Salt" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Unit Price (LKR)</label>
                  <input type="number" placeholder="0.00" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                </div>
              </div>

              <div className="input-group">
                <label>Product Specifications</label>
                <textarea placeholder="Describe crystal grade, iodine content, packaging etc." value={form.details} onChange={e => setForm({...form, details: e.target.value})} />
              </div>

              <div className="form-bottom-row">
                <div className="input-group flex-grow">
                  <label className="file-label-modern">
                    <span className="file-status">{form.image ? "✓ Photo Selected" : "Upload Product Image"}</span>
                    <input type="file" onChange={e => setForm({...form, image: e.target.files[0]})} />
                  </label>
                </div>
                <button type="submit" className={`action-main-btn ${editingId ? 'is-update' : 'is-add'}`}>
                  {editingId ? "SAVE CHANGES" : "PUBLISH PRODUCT"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Live Inventory Table */}
        <section className="table-section">
          <div className="table-card">
            <div className="table-header-info">
              <h4>Live Inventory Status</h4>
              <span className="sync-note">● Automatically synced with Inward/Outward logs</span>
            </div>
            <div className="table-responsive">
              <table className="modern-saltern-table">
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Name & Specifications</th>
                    <th>Market Price</th>
                    <th>Live Stock</th>
                    <th className="text-center">Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div className="table-img-box">
                          <img src={`http://localhost:5000${p.image}`} alt={p.name} />
                        </div>
                      </td>
                      <td>
                        <div className="name-col">
                          <strong>{p.name}</strong>
                          <span>{p.details?.substring(0, 50)}...</span>
                        </div>
                      </td>
                      <td className="price-tag">Rs. {parseFloat(p.price).toLocaleString()}</td>
                      // AdminProducts.jsx Table Row 
                      <td>
                        <div className={`stock-badge ${p.stock > 100 ? 'high' : 'low'}`}>
                            {p.stock || 0} kg
                        </div>
                      </td>
                      <td>
                        <div className="btn-flex-actions">
                          <button className="btn-action edit" onClick={() => handleEdit(p)}>Edit</button>
                          <button className="btn-action delete" onClick={() => handleDelete(p._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default AdminProducts;