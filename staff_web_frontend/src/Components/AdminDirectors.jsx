import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./AdminDirectors.css";

function AdminDirectors() {
  const { token } = useContext(AuthContext);

  const [directors, setDirectors] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", description: "", image: null });
  const [editingId, setEditingId] = useState(null);

  const fetchDirectors = async () => {
    const res = await fetch("http://localhost:5000/api/directors");
    const data = await res.json();
    setDirectors(data);
  };

  useEffect(() => { fetchDirectors(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("role", form.role);
    data.append("description", form.description);
    if (form.image) data.append("image", form.image);

    const url = editingId
      ? `http://localhost:5000/api/directors/${editingId}`
      : "http://localhost:5000/api/directors";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });

    setForm({ name: "", role: "", description: "", image: null });
    setEditingId(null);
    fetchDirectors();
  };

  const handleEdit = (director) => {
    setForm({
      name: director.name,
      role: director.role,
      description: director.description,
      image: null
    });
    setEditingId(director._id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Form eka thiyena udata scroll wenawa
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`http://localhost:5000/api/directors/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchDirectors();
  };

  return (
    <div className="admin-directors-wrapper">
      <header className="page-header-minimal">
        <h2>{editingId ? "Edit Board Member" : "Board of Directors"}</h2>
        <p>Manage the leadership team and their profiles</p>
      </header>

      {/* Modern Compact Form */}
      <section className="director-form-container">
        <form onSubmit={handleSubmit} className="modern-horizontal-form">
          <div className="form-inputs-top">
            <div className="input-field">
              <label>Full Name</label>
              <input value={form.name} placeholder="Director Name"
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="input-field">
              <label>Designation / Role</label>
              <input value={form.role} placeholder="CEO, Manager, etc."
                onChange={e => setForm({ ...form, role: e.target.value })} required />
            </div>
            <div className="input-field">
              <label>Profile Picture</label>
              <input type="file" className="file-input"
                onChange={e => setForm({ ...form, image: e.target.files[0] })} />
            </div>
          </div>
          
          <div className="form-inputs-bottom">
            <div className="input-field wide">
              <label>Short Biography</label>
              <textarea value={form.description} placeholder="A brief description about the director..."
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <button type="submit" className={`action-btn ${editingId ? 'update-mode' : 'add-mode'}`}>
              {editingId ? "Update Member" : "Add Member"}
            </button>
            {editingId && (
              <button type="button" className="cancel-mini-btn" onClick={() => { setEditingId(null); setForm({ name: "", role: "", description: "", image: null }); }}>Cancel</button>
            )}
          </div>
        </form>
      </section>

      {/* Grid of 3 Directors */}
      <div className="directors-grid-3">
        {directors.map(d => (
          <div className="director-card-modern" key={d._id}>
            <div className="profile-img-box">
              <img src={`http://localhost:5000${d.imageUrl}`} alt={d.name} />
            </div>
            <div className="director-info">
              <h3>{d.name}</h3>
              <span className="role-tag">{d.role}</span>
              <p>{d.description}</p>
              <div className="card-actions">
                <button className="edit-link" onClick={() => handleEdit(d)}>Edit</button>
                <button className="delete-link" onClick={() => handleDelete(d._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDirectors;