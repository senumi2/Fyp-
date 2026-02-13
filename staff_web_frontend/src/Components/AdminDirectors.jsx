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

  // Add or update director
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
    <div className="admin-directors">
      <h2>{editingId ? "Edit Director" : "Add Director"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Role"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <input type="file" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <hr />

      <div className="director-list">
        {directors.map(d => (
          <div className="director-item" key={d._id}>
            <img src={`http://localhost:5000${d.imageUrl}`} alt={d.name} />
            <div>
              <h3>{d.name}</h3>
              <p>{d.role}</p>
              <p>{d.description}</p>
              <button onClick={() => handleEdit(d)}>Edit</button>
              <button onClick={() => handleDelete(d._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDirectors;
