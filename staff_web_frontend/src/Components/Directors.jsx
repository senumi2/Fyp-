import { useEffect, useState } from "react";
import "./Directors.css";

function Directors() {
  const [directors, setDirectors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/directors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDirectors(data);
        }
      })
      .catch((err) => console.error("Error fetching directors:", err));
  }, []);

  const itemsVisible = 3;

  const nextSlide = () => {
    if (currentIndex < directors.length - itemsVisible) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (directors.length === 0) return null;

  return (
    <section className="creative-directors-section"id="board-section">
      <div className="modern-container-full">
        <header className="section-header">
          <span className="sub-title">OUR LEADERSHIP</span>
          <h2 className="section-title">Meet The Visionaries</h2>
          <div className="title-underline"></div>
        </header>

        <div className="modern-slider-wrapper">
          {/* Left Navigation Button with SVG Icon */}
          <button
            className={`modern-nav-btn left ${currentIndex === 0 ? "is-disabled" : ""}`}
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>

          <div className="modern-window">
            <div
              className="modern-track"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsVisible)}%)`
              }}
            >
              {directors.map((director) => (
                <div key={director._id} className="director-modern-item">
                  <div className="creative-director-card">
                    <div className="image-container">
                      <div className="shape-bg"></div>
                      <div className="image-frame">
                        <img
                          src={`http://localhost:5000${director.imageUrl}`}
                          alt={director.name}
                          className="director-photo"
                        />
                      </div>
                    </div>

                    <div className="director-details">
                      <p className="role">{director.role}</p>
                      <h3 className="name">{director.name}</h3>
                      <div className="details-divider"></div>
                      <p className="description-summary">{director.description}</p>
                      {/* "in" logo has been removed from here */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Navigation Button with SVG Icon */}
          <button
            className={`modern-nav-btn right ${currentIndex >= directors.length - itemsVisible ? "is-disabled" : ""}`}
            onClick={nextSlide}
            disabled={currentIndex >= directors.length - itemsVisible}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Directors;