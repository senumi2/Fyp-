import React, { useEffect, useState } from "react";
import "./Events.css";

function Events() {
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
    <section className="events-section" id="events">
      <div className="events-background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      
      <div className="events-container">
        <div className="events-header">
          <h2 className="section-title">Events & <span>Activities</span></h2>
          <p className="section-subtitle">Discover our upcoming events and community activities</p>
          <div className="title-underline"></div>
        </div>

        <div className="event-grid">
          {displayedEvents.map(event => (
            <div key={event._id} className="event-card">
              <div className="event-image-wrapper">
                <img
                  src={`http://localhost:5000${event.imageUrl}`}
                  alt={event.title}
                  className="event-img"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='180'%3E%3Crect fill='%23002A5C' width='280' height='180'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23F1FAEE'%3EEvent Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="event-date-badge">
                   {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <div className="event-footer">
                  <span className="full-date">
                    📅 {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length > 3 && (
          <div className="view-more-wrapper">
            <button
              className="creative-view-btn"
              onClick={() => setShowAll(!showAll)}
            >
              <span>{showAll ? "Show Less" : "Explore All Events"}</span>
              <i className="btn-icon">{showAll ? "▲" : "▼"}</i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Events;