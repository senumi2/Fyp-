import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminEvents() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    image: null
  });

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:5000/api/events");
    const data = await res.json();
    setEvents(data);
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

    fetchEvents();
  };

  return (
    <div>
      <h2>Add Event</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Title"
          onChange={e => setForm({...form, title:e.target.value})} required />
        <input type="date"
          onChange={e => setForm({...form, date:e.target.value})} required />
        <textarea placeholder="Description"
          onChange={e => setForm({...form, description:e.target.value})} />
        <input type="file"
          onChange={e => setForm({...form, image:e.target.files[0]})} required />
        <button>Add Event</button>
      </form>

      <hr />

      {events.map(event => (
        <div key={event._id}>
          <p>{event.title}</p>
          <button onClick={() =>
            fetch(`http://localhost:5000/api/events/${event._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` }
            }).then(fetchEvents)
          }>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AdminEvents;
