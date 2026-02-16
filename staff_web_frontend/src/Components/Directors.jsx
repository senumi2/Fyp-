import { useEffect, useState } from "react";
import "./Directors.css";

function Directors() {
  // Sample directors for fallback
  const defaultDirectors = [
    {
      _id: "1",
      name: "Mr. Perera",
      role: "Managing Director",
      description: "Visionary leader with 25+ years of industry expertise",
      imageUrl: "/uploads/director1.jpg"
    },
    {
      _id: "2",
      name: "Mr. Fernando",
      role: "Technical Director",
      description: "Expert in sustainable production methods",
      imageUrl: "/uploads/director2.jpg"
    },
    {
      _id: "3",
      name: "Mr. Silva",
      role: "Business Director",
      description: "Strategic growth and market expansion specialist",
      imageUrl: "/uploads/director3.jpg"
    }
  ];

  const [directors, setDirectors] = useState(defaultDirectors);

  useEffect(() => {
    fetch("http://localhost:5000/api/directors")
      .then(res => res.json())
      .then(data => {
        console.log("Directors fetched:", data);
        if (Array.isArray(data) && data.length > 0) {
          setDirectors(data);
        }
      })
      .catch(err => {
        console.log("Error fetching directors, using default:", err);
      });
  }, []);

  const displayedDirectors = directors.slice(0, 3);

  return (
    <section className="directors">
      <div className="directors-container">
        <h2 className="section-title">The Board Of Directors</h2>
        <p className="section-subtitle">Meet our experienced leadership team</p>

        <div className="directors-grid">
          {displayedDirectors.map(director => (
            <div key={director._id} className="director-card">
              <div className="director-image-wrapper">
                <img 
                  src={`http://localhost:5000${director.imageUrl}`} 
                  alt={director.name}
                  className="director-img"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Ccircle cx='75' cy='75' r='75' fill='%23ddd'/%3E%3Ctext x='50%23' y='50%23' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="director-content">
                <h3 className="director-name">{director.name}</h3>
                <p className="director-role">{director.role}</p>
                <p className="director-description">{director.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Directors;
