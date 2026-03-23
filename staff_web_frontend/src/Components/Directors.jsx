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
    <section className="modern-directors-section" id="directors">
      <div className="modern-container-full"> 
        <header className="section-header">
          <span className="sub-title">OUR LEADERSHIP</span>
          <h2 className="section-title">The Board Of Directors</h2>
          <div className="title-underline"></div>
        </header>

        <div className="modern-slider-wrapper">
          <button 
            className={`modern-arrow left ${currentIndex === 0 ? "is-disabled" : ""}`} 
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            &#10094;
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
                  <div className="director-modern-card">
                    <div className="card-top-accent"></div>
                    <div className="image-frame">
                      <img 
                        src={`http://localhost:5000${director.imageUrl}`} 
                        alt={director.name}
                        className="director-photo"
                      />
                    </div>
                    <div className="director-details">
                      <h3 className="name">{director.name}</h3>
                      <p className="role">{director.role}</p>
                      <p className="description-summary">{director.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className={`modern-arrow right ${currentIndex >= directors.length - itemsVisible ? "is-disabled" : ""}`} 
            onClick={nextSlide}
            disabled={currentIndex >= directors.length - itemsVisible}
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}

export default Directors;