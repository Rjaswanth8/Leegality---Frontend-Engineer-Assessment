import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../services/api";
import Navbar from "../components/Navbar";
import { useShop } from "../ShopContext";
import "../styles/productDetail.css";

const StarRating = ({ rating, size = "normal" }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= Math.round(rating) ? "star-filled" : "star-empty"}>★</span>
    );
  }
  return <div className={size === "detail" ? "detail-stars" : "review-stars"}>{stars}</div>;
};

/* Toast notification */
const Toast = ({ message, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)",
      background: "var(--navy)", color: "var(--white)",
      padding: "12px 24px", borderRadius: "30px",
      fontSize: "14px", fontWeight: 600,
      boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
      zIndex: 500, animation: "toastIn 0.2s ease",
      display: "flex", alignItems: "center", gap: "8px",
      whiteSpace: "nowrap"
    }}>
      {message}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, isInCart, isInWishlist, removeFromWishlist } = useShop();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProductById(id)
      .then((data) => {
        if (data?.id) { setProduct(data); setActiveImg(data.thumbnail); }
        else setError("Product not found.");
      })
      .catch(() => setError("Failed to load product. Please try again."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="detail-loading">
          <div className="spinner" />
          <span>Loading product…</span>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="detail-error">
          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>{error}</p>
          <button className="back-btn" onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.thumbnail];
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setToast(`🛒 Added ${qty} × "${product.title.slice(0, 30)}…" to cart`);
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      setToast(`Removed from wishlist`);
    } else {
      addToWishlist(product);
      setToast(`♥ Added to wishlist`);
    }
  };

  const formatDate = (d) => {
    try { return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
    catch { return ""; }
  };

  return (
    <>
      <Navbar />
      <div className="detail-page">
        <div className="detail-inner">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </button>

          <div className="detail-card">
            {/* Image Column */}
            <div className="detail-img-col">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <img src={activeImg || product.thumbnail} alt={product.title} />
                {images.length > 1 && (
                  <div className="detail-thumbnails">
                    {images.slice(0, 6).map((img, i) => (
                      <img
                        key={i} src={img} alt={`thumb-${i}`}
                        className={`thumb ${activeImg === img ? "active" : ""}`}
                        onClick={() => setActiveImg(img)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Info Column */}
            <div className="detail-info-col">
              <span className="detail-category-badge">{product.category}</span>
              <h1 className="detail-title">{product.title}</h1>

              <div className="detail-price-row">
                <span className="detail-price">${product.price}</span>
                {product.discountPercentage > 0 && (
                  <span style={{
                    background: "#dcfce7", color: "#166534",
                    fontSize: "13px", fontWeight: 700,
                    padding: "3px 9px", borderRadius: "20px"
                  }}>−{product.discountPercentage?.toFixed(1)}% OFF</span>
                )}
              </div>

              <div className="detail-rating-row">
                <StarRating rating={product.rating} size="detail" />
                <span className="detail-rating-text">
                  {product.rating?.toFixed(1)} · {product.reviews?.length || 0} reviews
                </span>
              </div>

              <div className="detail-meta">
                {product.brand && (
                  <div className="detail-meta-item">
                    <span className="detail-meta-label">Brand</span>
                    <span className="detail-meta-value">{product.brand}</span>
                  </div>
                )}
                <div className="detail-meta-item">
                  <span className="detail-meta-label">Category</span>
                  <span className="detail-meta-value" style={{ textTransform: "capitalize" }}>{product.category}</span>
                </div>
                {product.stock !== undefined && (
                  <div className="detail-meta-item">
                    <span className="detail-meta-label">Stock</span>
                    <span className="detail-meta-value" style={{ color: product.stock > 0 ? "var(--green)" : "var(--red)" }}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                )}
              </div>

              <div className="detail-desc-title">Description</div>
              <p className="detail-desc">{product.description}</p>

              {/* Qty + Actions */}
              <div className="detail-qty-row">
                <span className="detail-qty-label">Qty:</span>
                <div className="detail-qty-ctrl">
                  <button className="qty-ctrl-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span className="qty-ctrl-val">{qty}</span>
                  <button className="qty-ctrl-btn" onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}>+</button>
                </div>
              </div>

              <div className="detail-actions">
                <button
                  className={`btn-primary ${inCart ? "btn-in-cart" : ""}`}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {inCart ? "✓ Add More to Cart" : "🛒 Add to Cart"}
                </button>
                <button
                  className={`btn-secondary ${inWishlist ? "btn-in-wishlist" : ""}`}
                  onClick={handleWishlist}
                >
                  {inWishlist ? "♥ Wishlisted" : "♡ Wishlist"}
                </button>
              </div>
            </div>
          </div>

          {/* Reviews */}
          {product.reviews?.length > 0 && (
            <div className="reviews-section">
              <div className="reviews-title">Customer Reviews</div>
              <div className="reviews-list">
                {product.reviews.map((review, i) => (
                  <div className="review-card" key={i}>
                    <div className="review-header">
                      <div className="review-avatar">{review.reviewerName?.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="review-name">{review.reviewerName}</div>
                        <div style={{ fontSize: "12px", color: "var(--gray-500)" }}>{review.reviewerEmail}</div>
                      </div>
                      <div className="review-date">{formatDate(review.date)}</div>
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
};

export default ProductDetail;
