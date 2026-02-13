import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({
    user: "",
    rating: 5,
    comment: ""
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Product not found");
        }
        return res.json();
      })
      .then(data => {
        console.log("Fetched product:", data);
        setProduct(data);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setProduct(null);
      });
  }, [id]);

  if (!product) {
    return <p style={{ padding: "50px" }}>Product not found</p>;
  }

  const increaseQty = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddReview = () => {
    if (!review.user || !review.comment) {
      alert("Please fill in all review fields");
      return;
    }
    console.log("Review submitted:", review);
    alert("Thank you for your review!");
    setReview({ user: "", rating: 5, comment: "" });
  };

  return (
    <div className="product-detail">
      <img
        src={`http://localhost:5000${product.imageUrl}`}
        alt={product.name}
      />

      <div className="product-info">
        <h2>{product.name}</h2>

        <p className="description">{product.description}</p>

        <p className="price">Price: Rs. {product.price}</p>

        <p className="stock">
          Available Stock: {product.stock > 0 ? product.stock : "Out of Stock"}
        </p>

        {/* Quantity */}
        <div className="quantity">
          <button onClick={decreaseQty}>-</button>
          <span>{quantity}</span>
          <button onClick={increaseQty}>+</button>
        </div>

        {/* Buttons */}
        <div className="btn-group">
          <button className="add-cart">Add to Cart</button>
          <button className="buy-now">Buy Now</button>
        </div>

        {/* Reviews Section */}
        <div className="reviews">
          <h3>Customer Reviews</h3>

          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((r, i) => (
              <div key={i} className="review-card">
                <strong>{r.user}</strong>
                <span> ({r.rating}/5)</span>
                <p>{r.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}

          {/* Add Review */}
          <div className="add-review">
            <h4>Add Your Review</h4>

            <input
              type="text"
              placeholder="Your Name"
              value={review.user}
              onChange={e =>
                setReview({ ...review, user: e.target.value })
              }
            />

            <input
              type="number"
              min="1"
              max="5"
              value={review.rating}
              onChange={e =>
                setReview({ ...review, rating: Number(e.target.value) })
              }
            />

            <textarea
              placeholder="Write your review..."
              value={review.comment}
              onChange={e =>
                setReview({ ...review, comment: e.target.value })
              }
            />

            <button onClick={handleAddReview}>
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
