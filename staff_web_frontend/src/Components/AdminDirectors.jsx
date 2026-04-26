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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="admin-directors-page">
      <div className="bg-decoration"></div>
      <div className="content-container">
        
        <header className="directors-header">
          <div className="header-info">
            <h1>{editingId ? "Refine Profile" : "Leadership Core"}</h1>
            <p>Empower your saltern's vision by managing the board of directors</p>
          </div>
          {editingId && (
            <button className="exit-edit-pill" onClick={() => { setEditingId(null); setForm({ name: "", role: "", description: "", image: null }); }}>
              Exit Editing Mode
            </button>
          )}
        </header>

        {/* --- Creative Management Form --- */}
        <section className="form-wrapper-creative">
          <form onSubmit={handleSubmit} className="premium-glass-form">
            <div className="form-grid-layout">
              <div className="form-main-inputs">
                <div className="input-group-modern">
                  <label>Full Name</label>
                  <input value={form.name} placeholder="e.g. Saman Perera"
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="input-group-modern">
                  <label>Official Role</label>
                  <input value={form.role} placeholder="e.g. Managing Director"
                    onChange={e => setForm({ ...form, role: e.target.value })} required />
                </div>
                <div className="input-group-modern">
                  <label className="file-label-creative">
                    <span>{form.image ? "✓ Photo Ready" : "Upload Portrait"}</span>
                    <input type="file" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                  </label>
                </div>
              </div>
              
              <div className="form-bio-area">
                <div className="input-group-modern">
                  <label>Executive Biography</label>
                  <textarea value={form.description} placeholder="Briefly describe their expertise and contribution..."
                    onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <button type="submit" className={`hero-action-btn ${editingId ? 'is-updating' : 'is-adding'}`}>
                  {editingId ? "Save Changes" : "Commit to Board"}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* --- Directors Grid --- */}
        <section className="display-section">
          <div className="section-label">Board Members <span>({directors.length})</span></div>
          <div className="creative-directors-grid">
            {directors.map(d => (
              <div className="director-card-premium" key={d._id}>
                <div className="card-top-deco"></div>
                <div className="profile-orbit">
                  <div className="profile-circle">
                    <img src={`http://localhost:5000${d.imageUrl}`} alt={d.name} />
                  </div>
                </div>
                <div className="director-details">
                  <h3>{d.name}</h3>
                  <div className="role-badge">{d.role}</div>
                  <p>{d.description}</p>
                  <div className="action-row">
                    <button className="btn-edit-link" onClick={() => handleEdit(d)}>
                       Modify
                    </button>
                    <button className="btn-delete-link" onClick={() => handleDelete(d._id)}>
                       Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default AdminDirectors;