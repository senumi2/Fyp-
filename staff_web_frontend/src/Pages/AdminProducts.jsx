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
    availableStock: "",
    image: null,
  });

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
    data.append("availableStock", form.availableStock);
    if (form.image) data.append("image", form.image);

    const url = editingId 
      ? `http://localhost:5000/api/products/${editingId}` 
      : "http://localhost:5000/api/products";
    
    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });

    setForm({ name: "", price: "", details: "", availableStock: "", image: null });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      price: p.price,
      details: p.details,
      availableStock: p.availableStock,
      image: null
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    }
  };

  return (
    <div className="admin-products-container">
      <div className="management-card">
        <h2 className="main-title">| SPARE PARTS MANAGEMENT</h2>
        
        <form className="parts-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label>Name</label>
              <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Price (Rs.)</label>
              <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Stock</label>
              <input type="number" placeholder="Stock" value={form.availableStock} onChange={e => setForm({...form, availableStock: e.target.value})} required />
            </div>
            <div className="input-group full-width">
              <label>Description / Details</label>
              <textarea placeholder="Description" value={form.details} onChange={e => setForm({...form, details: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Image</label>
              <input type="file" className="file-btn" onChange={e => setForm({...form, image: e.target.files[0]})} />
            </div>
          </div>
          <button type="submit" className="add-part-btn">
            {editingId ? "UPDATE PART" : "ADD PART"}
          </button>
        </form>
      </div>

      <div className="table-container">
        <table className="parts-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td><img src={`http://localhost:5000${p.image}`} alt={p.name} className="table-img" /></td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.availableStock}</td>
                <td>
                  <div className="action-btns">
                    <button className="edit-btn" onClick={() => handleEdit(p)}>EDIT</button>
                    <button className="delete-btn" onClick={() => handleDelete(p._id)}>DELETE</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;