import { createContext, useContext, useState } from "react";

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const updateCartQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const addToWishlist = (product) => {
    setWishlist((prev) =>
      prev.find((i) => i.id === product.id) ? prev : [...prev, product]
    );
  };

  const removeFromWishlist = (id) =>
    setWishlist((prev) => prev.filter((i) => i.id !== id));

  const isInWishlist = (id) => wishlist.some((i) => i.id === id);
  const isInCart = (id) => cart.some((i) => i.id === id);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <ShopContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateCartQty, isInCart, cartTotal, cartCount,
        wishlist, addToWishlist, removeFromWishlist, isInWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
