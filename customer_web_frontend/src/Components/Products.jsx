import React, { useEffect, useState } from "react";
import "./Products.css";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log("Error fetching products:", err));
  }, []);

  return (
    <section className="products-section" id="products">
      <div className="container">
        <div className="section-header">
          <h2 className="title">Our Premium Selection</h2>
          <div className="underline"></div>
          <p className="subtitle">High-quality salt products crafted for excellence</p>
        </div>
        
        
        <div className="product-grid product-list">
          {products.map((product, index) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`} 
              className="product-card"
              style={{ "--delay": index }}
            >
              <div className="product-image-container">
                <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <button className="explore-btn">Explore</button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;