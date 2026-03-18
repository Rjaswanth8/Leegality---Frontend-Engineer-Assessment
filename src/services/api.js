const BASE_URL = "https://dummyjson.com";

export const fetchProducts = async (limit = 8, skip = 0) => {
  const res = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
  return res.json();
};

export const fetchProductsByCategory = async (category, limit = 100, skip = 0) => {
  const res = await fetch(`${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`);
  return res.json();
};

export const fetchAllProducts = async () => {
  const res = await fetch(`${BASE_URL}/products?limit=100&skip=0`);
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/products/categories`);
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return res.json();
};

export const searchProducts = async (query) => {
  const res = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=100`);
  return res.json();
};
