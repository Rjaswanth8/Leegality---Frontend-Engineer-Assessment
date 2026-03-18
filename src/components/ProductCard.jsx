import { useNavigate } from "react-router-dom";
import { useShop } from "../ShopContext";
import "../styles/productCard.css";

export const StarRating = ({ rating, className = "stars" }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= Math.round(rating) ? "star-filled" : "star-empty"}>★</span>
    );
  }
  return (
    <div className={className}>
      {stars}
      <span className="rating-count">({rating?.toFixed(1)})</span>
    </div>
  );
};

/* ── Quick Preview Modal ─────────────────────────── */
const QuickPreview = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInCart, isInWishlist } = useShop();

  const inCart    = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleAddCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWish = (e) => {
    e.stopPropagation();
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  const handleViewFull = (e) => {
    e.stopPropagation();
    onClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="preview-backdrop" onClick={handleBackdropClick}>
      <div className="preview-modal">
        <button className="preview-close" onClick={onClose}>×</button>

        {/* Image */}
        <div className="preview-img-col">
          <img src={product.thumbnail} alt={product.title} />
        </div>

        {/* Info */}
        <div className="preview-info-col">
          <div className="preview-category">{product.category}</div>
          <h2 className="preview-title">{product.title}</h2>

          <div className="preview-price-row">
            <span className="preview-price">${product.price}</span>
            {product.discountPercentage > 0 && (
              <span className="preview-discount">−{product.discountPercentage?.toFixed(1)}% OFF</span>
            )}
          </div>

          <div className="preview-stars">
            {[1,2,3,4,5].map((i) => (
              <span key={i} className={i <= Math.round(product.rating) ? "star-filled" : "star-empty"}>★</span>
            ))}
            <span className="preview-rating-text">{product.rating?.toFixed(1)} rating</span>
          </div>

          <div className="preview-meta">
            {product.brand && (
              <div className="preview-meta-item">
                <span className="preview-meta-label">Brand</span>
                <span className="preview-meta-value">{product.brand}</span>
              </div>
            )}
            {product.stock !== undefined && (
              <div className="preview-meta-item">
                <span className="preview-meta-label">Stock</span>
                <span className="preview-meta-value" style={{ color: product.stock > 0 ? "var(--green)" : "var(--red)" }}>
                  {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                </span>
              </div>
            )}
          </div>

          <p className="preview-desc">{product.description}</p>

          <div className="preview-actions">
            <button
              className={`preview-btn-cart ${inCart ? "in-cart" : ""}`}
              onClick={handleAddCart}
            >
              {inCart ? "✓ Added to Cart" : "🛒 Add to Cart"}
            </button>
            <button
              className={`preview-btn-wish ${inWishlist ? "in-wish" : ""}`}
              onClick={handleWish}
              title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {inWishlist ? "♥" : "♡"}
            </button>
            <button className="preview-btn-detail" onClick={handleViewFull}>
              Full Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Product Card ────────────────────────────────── */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInCart, isInWishlist } = useShop();
  // No local preview state here — lifted to parent to avoid re-render
  // We use a custom event instead
  const handleCardClick = () => navigate(`/product/${product.id}`);

  const handlePreview = (e) => {
    e.stopPropagation();
    // Dispatch custom event up to ProductList
    window.dispatchEvent(new CustomEvent("openPreview", { detail: product }));
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-card-img-wrap">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        <button className="quick-preview-btn" onClick={handlePreview}>
          Quick Preview
        </button>
      </div>
      <div className="product-card-body">
        <div className="product-card-title">{product.title}</div>
        <div className="product-card-bottom">
          <span className="product-card-price">${product.price}</span>
          <StarRating rating={product.rating} />
        </div>
      </div>
    </div>
  );
};

export { QuickPreview };
export default ProductCard;
