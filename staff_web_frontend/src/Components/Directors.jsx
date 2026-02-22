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

  const itemsVisible = 3; // Number of cards visible at once

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

  if (directors.length === 0) return <div className="loading">Loading Leadership Team...</div>;

  return (
    <section className="directors-section" id="directors">
      <div className="directors-container">
        <header className="section-header">
          <h2 className="section-title">The Board Of Directors</h2>
          <div className="title-underline"></div>
        </header>

        <div className="slider-wrapper">
          {/* Navigation Arrows */}
          <button 
            className={`slide-arrow left ${currentIndex === 0 ? "is-disabled" : ""}`} 
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            &#10094;
          </button>

          <div className="directors-window">
            <div 
              className="directors-track" 
              style={{ 
                transform: `translateX(-${currentIndex * (100 / itemsVisible)}%)` 
              }}
            >
              {directors.map((director) => (
                <div key={director._id} className="director-item">
                  <div className="director-card">
                    
                    <div className="image-wrapper">
                      <img 
                        src={`http://localhost:5000${director.imageUrl}`} 
                        alt={director.name}
                        className="director-photo"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x500?text=No+Photo";
                        }}
                      />
                    </div>
                    
                    <div className="director-info">
                      <h3 className="name">{director.name}</h3>
                      <p className="role">{director.role}</p>
                      <p className="bio">{director.description}</p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className={`slide-arrow right ${currentIndex >= directors.length - itemsVisible ? "is-disabled" : ""}`} 
            onClick={nextSlide}
            aria-label="Next slide"
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}

export default Directors;