import React, { useState, useEffect } from "react";
import "./Event.css";

function Events() {
  const [events, setEvents] = useState([]);

  // fetch events from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <section className="events">
      <h2>Events & Activities</h2>

      {/* display events */}
      {events.map(event => (
        <div key={event._id} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <img
            src={`http://localhost:5000${event.imageUrl}`}
            alt={event.title}
            width="200"
          />
          <p>{new Date(event.date).toLocaleDateString()}</p>
        </div>
      ))}

      <button className="view-btn">View more</button>
    </section>
  );
}

export default Events;
