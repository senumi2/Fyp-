import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./AdminEvents.css";

function AdminEvents() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", date: "", image: null });

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("date", form.date);
    data.append("image", form.image);

    await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });

    setForm({ title: "", description: "", date: "", image: null });
    fetchEvents();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    }
  };

  return (
    <div className="admin-events-page">
      <div className="content-wrapper">
        <header className="header-minimal">
          <h2>Event Management</h2>
          <span>Manage and organize all your upcoming activities</span>
        </header>

        {/* Modern Compact Form Section */}
        <div className="modern-form-container">
          <form onSubmit={handleSubmit} className="glass-form">
            <div className="form-row">
              <div className="input-box">
                <label>Title</label>
                <input type="text" placeholder="Event Name" value={form.title}
                  onChange={e => setForm({...form, title:e.target.value})} required />
              </div>
              <div className="input-box">
                <label>Date</label>
                <input type="date" value={form.date}
                  onChange={e => setForm({...form, date:e.target.value})} required />
              </div>
              <div className="input-box">
                <label>Banner</label>
                <input type="file" className="file-input-custom"
                  onChange={e => setForm({...form, image:e.target.files[0]})} required />
              </div>
            </div>
            <div className="form-row secondary">
              <div className="input-box description">
                <label>Description</label>
                <textarea placeholder="Write a brief description..." value={form.description}
                  onChange={e => setForm({...form, description:e.target.value})} />
              </div>
              <button type="submit" className="neon-add-btn">Publish Event</button>
            </div>
          </form>
        </div>

        {/* Events Grid Section (4 items per row) */}
        <div className="events-grid-container">
          {events.length > 0 ? (
            events.map(event => (
              <div className="modern-event-card" key={event._id}>
                <div className="card-media">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} />
                  ) : (
                    <div className="img-placeholder">No Image</div>
                  )}
                  <div className="card-badge">{new Date(event.date).toLocaleDateString()}</div>
                </div>
                <div className="card-info">
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                  <button className="del-btn" onClick={() => handleDelete(event._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">No events to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminEvents;