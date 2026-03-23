import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 
import { 
  FiTrash2, 
  FiShoppingCart, 
  FiCreditCard, 
  FiMessageSquare, 
  FiStar, 
  FiAlertCircle, 
  FiShield 
} from "react-icons/fi";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <div className="loading-container">Loading Product...</div>;

  // 🛒 Add to Cart Logic
  const addToCart = () => {
    const currentQty = quantity < 1 ? 1 : quantity;
    const cartItem = { 
      id: product._id, 
      name: product.name, 
      price: product.price, 
      image: product.imageUrl, 
      qty: currentQty 
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isExist = existingCart.find((item) => item.id === product._id);

    if (isExist) {
      isExist.qty += currentQty;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setQuantity(currentQty); 
    alert("Product added to cart!");
  };

  // ⚡ Buy Now Logic
  const buyNow = () => {
    addToCart();
    navigate("/payment");
  };

  // 📝 Review Actions
  const handleAddReview = async () => {
    if (!user) return alert("Please login first");
    if (!review.comment) return alert("Please write a comment");

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ rating: review.rating, comment: review.comment, user: user.fullName })
      });
      const data = await res.json();
      if (res.ok) {
        setProduct(data);
        setReview({ rating: 5, comment: "" });
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}/review/${reviewId}?userName=${user.fullName}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setProduct(data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="product-page">
      <div className="product-top-section">
        <div className="product-image-hold">
          <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} />
        </div>

        <div className="product-info-hold">
          <h2>{product.name}</h2>
          <p className="price-tag">Rs. {product.price.toLocaleString()}</p>
          <p className="description-text">{product.description}</p>
          
          {/* --- 🚀 Inventory Alert (Real-time Stock Status) --- */}
          <div className="stock-container">
            <p className={`stock-info ${product.stock < 50 ? "low-stock" : ""}`}>
              Available Stock: {product.stock} kg
            </p>
            {product.stock > 0 && product.stock < 50 && (
              <div className="stock-alert">
                <FiAlertCircle /> <span>Low stock! Order soon to avoid delays.</span>
              </div>
            )}
            {product.stock <= 0 && (
              <div className="out-of-stock-alert">
                <FiAlertCircle /> <span>Currently Out of Stock.</span>
              </div>
            )}
          </div>

          {/* --- 🛡️ Product Quality Specs --- */}
          <div className="quality-specs-box">
             <h4><FiShield /> Quality Specifications</h4>
             <div className="specs-grid">
                <div className="spec-item">
                  <span>Purity (NaCl)</span>
                  <strong>{product.purity || "98.5%"}</strong>
                </div>
                <div className="spec-item">
                  <span>Iodine Content</span>
                  <strong>{product.iodine || "25-30 ppm"}</strong>
                </div>
                <div className="spec-item">
                  <span>Moisture</span>
                  <strong>{product.moisture || "< 0.5%"}</strong>
                </div>
             </div>
          </div>

          <div className="quantity-box">
            <span>Quantity:</span>
            <input 
              type="number" 
              min="1" 
              max={product.stock}
              value={quantity === 0 ? "" : quantity} 
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setQuantity(0);
                } else {
                  const numVal = parseInt(val);
                  if (numVal > product.stock) {
                    setQuantity(product.stock);
                  } else {
                    setQuantity(numVal);
                  }
                }
              }}
              onBlur={() => {
                if (quantity < 1) setQuantity(1);
              }}
              className="custom-qty-input"
            />
          </div>

          <div className="action-buttons">
            <button className="btn-cart" onClick={addToCart} disabled={product.stock <= 0}>
              <FiShoppingCart /> Add to Cart
            </button>
            <button className="btn-buy" onClick={buyNow} disabled={product.stock <= 0}>
              <FiCreditCard /> Buy Now
            </button>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* --- Feedback Area --- */}
      <div className="feedback-area">
        <div className="title-row">
          <FiMessageSquare /> <h3>Customer Feedbacks</h3>
        </div>

        <div className="feedbacks-grid">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((r) => (
              <div key={r._id} className="feedback-card">
                <div className="card-header">
                  <div className="user-circle">{r.user.charAt(0)}</div>
                  <div className="user-meta">
                    <strong>{r.user}</strong>
                    <div className="star-display">
                      {[...Array(5)].map((_, index) => (
                        <FiStar
                          key={index}
                          size={14}
                          color={index + 1 <= r.rating ? "#ffc107" : "#e4e5e9"}
                          fill={index + 1 <= r.rating ? "#ffc107" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                  {user && user.fullName === r.user && (
                    <button className="delete-icon-btn" onClick={() => handleDeleteReview(r._id)}>
                      <FiTrash2 />
                    </button>
                  )}
                </div>
                <p className="comment-body">"{r.comment}"</p>
              </div>
            ))
          ) : (
            <p className="no-data">No feedbacks for this product yet.</p>
          )}
        </div>

        {user ? (
          <div className="add-feedback-form">
            <h4>Share Your Review</h4>
            <div className="form-inner">
              <select value={review.rating} onChange={e => setReview({ ...review, rating: parseInt(e.target.value) })}>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
              <textarea 
                placeholder="What's your experience with this item?" 
                value={review.comment} 
                onChange={e => setReview({ ...review, comment: e.target.value })} 
              />
              <button className="submit-feedback-btn" onClick={handleAddReview}>Post Feedback</button>
            </div>
          </div>
        ) : <p className="login-warn">Log in to post a feedback.</p>}
      </div>
    </div>
  );
}

export default ProductDetail;