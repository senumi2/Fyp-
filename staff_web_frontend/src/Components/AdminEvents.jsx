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
      <div className="overlay-gradient"></div>
      <div className="content-wrapper">
        <header className="header-creative">
          <div className="header-text">
            <h1>Event Hub</h1>
            <p>Curate and manage your saltern's upcoming milestones</p>
          </div>
          <div className="header-stats">
            <div className="stat-pill">Total Events: <b>{events.length}</b></div>
          </div>
        </header>

        {/* --- Modern Floating Form --- */}
        <section className="form-section-creative">
          <form onSubmit={handleSubmit} className="modern-glass-card">
            <div className="card-inner-title">Create New Event</div>
            <div className="creative-form-grid">
              <div className="input-group">
                <label>Event Title</label>
                <input type="text" placeholder="E.g. Annual Salt Harvest Festival" value={form.title}
                  onChange={e => setForm({...form, title:e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Date</label>
                <input type="date" value={form.date}
                  onChange={e => setForm({...form, date:e.target.value})} required />
              </div>
              <div className="input-group full-width">
                <label>Description</label>
                <textarea placeholder="Share details about the event..." value={form.description}
                  onChange={e => setForm({...form, description:e.target.value})} />
              </div>
              <div className="input-group">
                <label className="custom-file-upload">
                  <span>{form.image ? "✓ Image Selected" : "Upload  Image"}</span>
                  <input type="file" onChange={e => setForm({...form, image:e.target.files[0]})} required />
                </label>
              </div>
              <div className="submit-area">
                <button type="submit" className="btn-gradient-launch">Publish Event</button>
              </div>
            </div>
          </form>
        </section>

        {/* --- Creative Grid --- */}
        <section className="events-display-section">
          <div className="section-divider">
            <span>Current Live Events</span>
          </div>
          
          <div className="creative-events-grid">
            {events.length > 0 ? (
              events.map(event => (
                <div className="premium-event-card" key={event._id}>
                  <div className="card-top">
                    {event.imageUrl ? (
                     <img src={`http://localhost:5000${event.imageUrl}`} alt={event.title} />
                    ) : (
                      <div className="placeholder-art">No Image</div>
                    )}
                    <div className="date-tag">
                        {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div className="card-bottom">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <div className="card-actions">
                      <button className="btn-remove-minimal" onClick={() => handleDelete(event._id)}>
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Delete Event
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>No events found. Start by creating one above.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminEvents;