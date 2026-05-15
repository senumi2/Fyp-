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
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      })
      .catch((err) => console.log("Error fetching events:", err));
  }, []);

  const displayedEvents = showAll ? events : events.slice(0, 3);

  return (
   
    <section className="creative-events-section" id="events-section">
      <div className="events-container">
        <header className="events-header">
          <h2 className="section-title">Events & Activities</h2>
          <div className="title-bar"></div>
          <p className="section-subtitle">Experience the culture and community at our salterns</p>
        </header>

        <div className="event-grid">
          {displayedEvents.map((event) => {
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleString('default', { month: 'short' });

            return (
              <div key={event._id} className="modern-event-card">
                <div className="event-image-wrapper">
                  {/* Modern Date Badge Overlay */}
                  <div className="date-badge">
                    <span className="day">{day}</span>
                    <span className="month">{month}</span>
                  </div>
                  
                  <img
                    src={`http://localhost:5000${event.imageUrl}`}
                    alt={event.title}
                    className="event-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/600x400?text=Event+Coming+Soon";
                    }}
                  />
                  <div className="img-overlay"></div>
                </div>

                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {events.length > 3 && (
          <div className="btn-wrapper">
            <button
              className="premium-view-btn" 
              onClick={() => setShowAll(!showAll)}
            >
              <span className="btn-text">{showAll ? "Show Less" : "Explore All Events"}</span>
              <span className="btn-icon-circle">
                {showAll ? "↑" : "→"}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Events;