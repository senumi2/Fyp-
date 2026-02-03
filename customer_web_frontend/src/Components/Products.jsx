import { useEffect, useState } from "react";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <section className="products">
      <h2>Our Products</h2>

      <div className="product-grid">
        {products.map(item => (
          <div key={item._id} className="product-card">
            <img
              src={`http://localhost:5000${item.image}`}
              className="product-img"
            />
            <h4>{item.name}</h4>
            <p>Rs. {item.price}</p>
            <p>Stock: {item.availableStock}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;
