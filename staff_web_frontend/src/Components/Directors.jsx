import { useEffect, useState } from "react";
import "./Directors.css";

function Directors() {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/directors")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch directors");
        }
        return res.json();
      })
      .then((data) => {
        setDirectors(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading directors...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="directors">
      <h2>Board of Directors</h2>

      <div className="director-grid">
        {directors.map((director) => (
          <div className="director-card" key={director._id}>
            <img
              src={`http://localhost:5000${director.imageUrl}`}
              alt={director.name}
            />
            <h3>{director.name}</h3>
            <p className="role">{director.role}</p>
            <p>{director.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Directors;
