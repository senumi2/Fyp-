import React, { useEffect, useState } from "react";
import"./Events.css";

function Events() {
  // Sample events for fallback
  const defaultEvents = [
    {
      _id: "1",
      title: "Annual Salt Harvest Festival",
      description: "Join us for our annual harvest celebration with family activities and traditional performances.",
      date: "2025-03-15",
      imageUrl: "/uploads/event1.jpg"
    },
    {
      _id: "2",
      title: "Community Beach Cleanup",
      description: "Help us maintain our beautiful coastal areas while networking with community members.",
      date: "2025-04-20",
      imageUrl: "/uploads/event2.jpg"
    },
    {
      _id: "3",
      title: "Salt Production Workshop",
      description: "Learn about sustainable salt production methods from our expert team.",
      date: "2025-05-10",
      imageUrl: "/uploads/event3.jpg"
    }
  ];

  const [events, setEvents] = useState(defaultEvents);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(res => res.json())
      .then(data => {
        console.log("Events fetched:", data);
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      })
      .catch(err => {
        console.log("Error fetching events, using default:", err);
      });
  }, []);

  const displayedEvents = showAll ? events : events.slice(0, 3);

  return (
    <section className="events" id="events">
      <div className="events-container">
        <h2 className="section-title">Events & Activities</h2>
        <p className="section-subtitle">Discover our upcoming events and community activities</p>

        <div className="event-grid">
          {displayedEvents.map(event => (
            <div key={event._id} className="event-card">
              <div className="event-image-wrapper">
                <img
                  src={`http://localhost:5000${event.imageUrl}`}
                  alt={event.title}
                  className="event-img"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='180'%3E%3Crect fill='%23ddd' width='280' height='180'/%3E%3Ctext x='50%23' y='50%23' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23999'%3EEvent Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <span className="event-date">
                  📅 {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {events.length > 3 && (
          <button
            className="view-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less ▲" : "Explore Events ▼"}
          </button>
        )}
      </div>
    </section>
  );
}

export default Events;
