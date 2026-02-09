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
      <h2 className="products-title">Our Products</h2>

      <div className="product-grid">
        {products.map(item => (
          <div key={item._id} className="product-card">
            <div className="img-wrapper">
              <img
                src={`http://localhost:5000${item.image}`}
                alt={item.name}
                className="product-img"
              />
            </div>

            <h4>{item.name}</h4>
            <p className="price">Rs. {item.price}</p>
            <p className="stock">Stock: {item.availableStock}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;
