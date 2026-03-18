import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../ShopContext";
import { QuickPreview } from "./ProductCard";
import "../styles/navbar.css";

/* ── Shared close button ── */
const CloseBtn = ({ onClose }) => (
  <button className="panel-close-btn" onClick={onClose}>
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  </button>
);

/* ── Cart Panel ── */
const CartPanel = ({ onClose }) => {
  const { cart, removeFromCart, updateCartQty, cartTotal } = useShop();
  const [previewItem, setPreviewItem] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="side-panel">
        <div className="panel-header">
          <span className="panel-title">Your Cart</span>
          <CloseBtn onClose={onClose} />
        </div>

        {cart.length === 0 ? (
          <div className="panel-empty">
            <svg width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="panel-body">
              {cart.map((item) => (
                <div className="panel-item" key={item.id}>
                  <img
                    className="panel-item-img"
                    src={item.thumbnail}
                    alt={item.title}
                    onClick={() => { onClose(); navigate(`/product/${item.id}`); }}
                    style={{ cursor: "pointer" }}
                    title="View product"
                  />
                  <div className="panel-item-info">
                    <div
                      className="panel-item-title"
                      onClick={() => setPreviewItem(item)}
                      style={{ cursor: "pointer" }}
                      title="Quick preview"
                    >
                      {item.title}
                    </div>
                    <div className="panel-item-price">${(item.price * item.qty).toFixed(2)}</div>
                    <div className="panel-item-actions">
                      <div className="panel-item-qty">
                        <button className="qty-btn" onClick={() => updateCartQty(item.id, item.qty - 1)}>−</button>
                        <span className="qty-val">{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateCartQty(item.id, item.qty + 1)}>+</button>
                      </div>
                      <button className="panel-preview-link" onClick={() => setPreviewItem(item)}>
                        Quick view
                      </button>
                    </div>
                  </div>
                  <button className="panel-remove-btn" onClick={() => removeFromCart(item.id)} title="Remove">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="panel-footer">
              <div className="panel-total-row">
                <span className="panel-total-label">
                  Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)
                </span>
                <span className="panel-total-val">${cartTotal.toFixed(2)}</span>
              </div>
              <button className="panel-checkout-btn">Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>

      {previewItem && (
        <QuickPreview product={previewItem} onClose={() => setPreviewItem(null)} />
      )}
    </>
  );
};

/* ── Wishlist Panel ── */
const WishlistPanel = ({ onClose }) => {
  const { wishlist, removeFromWishlist, addToCart, isInCart } = useShop();
  const [previewItem, setPreviewItem] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="side-panel">
        <div className="panel-header">
          <span className="panel-title">Wishlist</span>
          <CloseBtn onClose={onClose} />
        </div>

        {wishlist.length === 0 ? (
          <div className="panel-empty">
            <svg width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p>Your wishlist is empty</p>
          </div>
        ) : (
          <div className="panel-body">
            {wishlist.map((item) => (
              <div className="panel-item" key={item.id}>
                <img
                  className="panel-item-img"
                  src={item.thumbnail}
                  alt={item.title}
                  onClick={() => { onClose(); navigate(`/product/${item.id}`); }}
                  style={{ cursor: "pointer" }}
                  title="View product"
                />
                <div className="panel-item-info">
                  <div
                    className="panel-item-title"
                    onClick={() => setPreviewItem(item)}
                    style={{ cursor: "pointer" }}
                    title="Quick preview"
                  >
                    {item.title}
                  </div>
                  <div className="panel-item-price">${item.price}</div>
                  <div className="panel-item-actions">
                    <button
                      className="move-to-cart-btn"
                      onClick={() => { addToCart(item); removeFromWishlist(item.id); }}
                    >
                      {isInCart(item.id) ? "✓ In Cart" : "Move to Cart"}
                    </button>
                    <button className="panel-preview-link" onClick={() => setPreviewItem(item)}>
                      Quick view
                    </button>
                  </div>
                </div>
                <button className="panel-remove-btn" onClick={() => removeFromWishlist(item.id)} title="Remove">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewItem && (
        <QuickPreview product={previewItem} onClose={() => setPreviewItem(null)} />
      )}
    </>
  );
};

/* ── Profile Panel — clean & simple ── */
const ProfilePanel = ({ onClose }) => {
  const { cart, wishlist } = useShop();

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="side-panel">
        <div className="panel-header">
          <span className="panel-title">My Profile</span>
          <CloseBtn onClose={onClose} />
        </div>

        <div className="panel-body">
          {/* Avatar block */}
          <div className="profile-hero">
            <div className="profile-avatar">AJ</div>
            <div className="profile-name">Alex Johnson</div>
            <div className="profile-email">alex.johnson@email.com</div>
          </div>

          {/* Quick stats */}
          <div className="profile-stats">
            <div className="profile-stat-card">
              <div className="profile-stat-val">{cart.reduce((s, i) => s + i.qty, 0)}</div>
              <div className="profile-stat-label">In Cart</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-val">{wishlist.length}</div>
              <div className="profile-stat-label">Wishlist</div>
            </div>
          </div>

          {/* Details */}
          <div className="profile-details">
            <div className="profile-detail-row">
              <span className="profile-detail-label">Member since</span>
              <span className="profile-detail-value">March 2022</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Location</span>
              <span className="profile-detail-value">San Francisco, CA</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Phone</span>
              <span className="profile-detail-value">+1 (555) 234-7890</span>
            </div>
          </div>

          <button className="profile-signout-btn">Sign Out</button>
        </div>
      </div>
    </>
  );
};

/* ── Main Navbar ── */
const Navbar = ({ onSearch }) => {
  const [query,     setQuery]     = useState("");
  const [openPanel, setOpenPanel] = useState(null);
  const { cartCount, wishlist }   = useShop();
  const navigate = useNavigate();

  const toggle = (panel) => setOpenPanel((prev) => (prev === panel ? null : panel));

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/")}>ShopEasy</div>

        <div className="navbar-search-wrap">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="navbar-search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); if (onSearch) onSearch(e.target.value); }}
          />
        </div>

        <div className="navbar-icons">
          <div className="navbar-icon-wrap">
            <button className={`navbar-icon-btn ${openPanel === "cart" ? "active" : ""}`} onClick={() => toggle("cart")} title="Cart">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </button>
            {cartCount > 0 && <span className="navbar-badge">{cartCount}</span>}
          </div>

          <div className="navbar-icon-wrap">
            <button className={`navbar-icon-btn ${openPanel === "wishlist" ? "active" : ""}`} onClick={() => toggle("wishlist")} title="Wishlist">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            {wishlist.length > 0 && <span className="navbar-badge">{wishlist.length}</span>}
          </div>

          <div className="navbar-icon-wrap">
            <button className={`navbar-icon-btn ${openPanel === "profile" ? "active" : ""}`} onClick={() => toggle("profile")} title="Profile">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {openPanel === "cart"     && <CartPanel     onClose={() => setOpenPanel(null)} />}
      {openPanel === "wishlist" && <WishlistPanel  onClose={() => setOpenPanel(null)} />}
      {openPanel === "profile"  && <ProfilePanel   onClose={() => setOpenPanel(null)} />}
    </>
  );
};

export default Navbar;
