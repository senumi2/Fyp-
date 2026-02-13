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
    <section className="products">
      <h2>Our Products</h2>
     
      <div className="product-grid">
        {products.map(product => (
          <Link
           key={product._id}
            to={`/product/${product._id}`} 
            className="product-card">
            <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} />
            <h3>{product.name}</h3>
           </Link>
        ))}
      </div>
    </section>
  );
}

export default Products;
