import { useEffect, useState, useCallback, useMemo } from "react";
import Navbar from "../components/Navbar";
import ProductCard, { QuickPreview } from "../components/ProductCard";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import {
  fetchAllProducts,
  fetchProductsByCategory,
  fetchCategories,
  searchProducts,
} from "../services/api";
import "../styles/productList.css";

const PRODUCTS_PER_PAGE = 8;
const SESSION_KEY = "shopEasyFilters";

const loadSavedFilters = () => {
  try {
    const s = sessionStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};
const saveFilters = (f) => {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(f)); } catch {}
};

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </div>
  </div>
);

const ProductList = () => {
  const saved = loadSavedFilters();

  const [allProducts,        setAllProducts]        = useState([]);
  const [categories,         setCategories]         = useState([]);
  const [loading,            setLoading]            = useState(true);
  const [error,              setError]              = useState(null);
  const [page,               setPage]               = useState(saved?.page || 1);
  const [selectedCategories, setSelectedCategories] = useState(saved?.selectedCategories || []);
  const [minPrice,           setMinPrice]           = useState(saved?.minPrice || "");
  const [maxPrice,           setMaxPrice]           = useState(saved?.maxPrice || "");
  const [selectedBrands,     setSelectedBrands]     = useState(saved?.selectedBrands || []);
  const [searchQuery,        setSearchQuery]        = useState("");
  const [previewProduct,     setPreviewProduct]     = useState(null);

  // Listen for quick-preview events from ProductCard
  useEffect(() => {
    const handler = (e) => setPreviewProduct(e.detail);
    window.addEventListener("openPreview", handler);
    return () => window.removeEventListener("openPreview", handler);
  }, []);

  // Persist filters
  useEffect(() => {
    saveFilters({ selectedCategories, minPrice, maxPrice, selectedBrands, page });
  }, [selectedCategories, minPrice, maxPrice, selectedBrands, page]);

  // Fetch categories
  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  // Fetch products
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (searchQuery.trim()) {
        data = await searchProducts(searchQuery.trim());
      } else if (selectedCategories.length === 1) {
        data = await fetchProductsByCategory(selectedCategories[0]);
      } else {
        data = await fetchAllProducts();
      }
      setAllProducts(data.products || []);
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategories, searchQuery]);

  useEffect(() => {
    fetchData();
    setPage(1);
  }, [fetchData]);

  const brands = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.brand).filter(Boolean));
    return [...set].sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (selectedCategories.length > 1 && !selectedCategories.includes(p.category)) return false;
      if (minPrice !== "" && p.price < Number(minPrice)) return false;
      if (maxPrice !== "" && p.price > Number(maxPrice)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      return true;
    });
  }, [allProducts, selectedCategories, minPrice, maxPrice, selectedBrands]);

  const totalPages       = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const handleClearAll = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedBrands([]);
    setSearchQuery("");
    setPage(1);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    setSelectedCategories([]);
    setPage(1);
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />

      <div className="page-layout">
        <Filters
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={(cats) => { setSelectedCategories(cats); setPage(1); }}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceApply={(min, max) => { setMinPrice(min); setMaxPrice(max); setPage(1); }}
          brands={brands}
          selectedBrands={selectedBrands}
          onBrandChange={(b) => { setSelectedBrands(b); setPage(1); }}
          onClearAll={handleClearAll}
        />

        <main className="products-section">
          {error && <div className="error-banner">⚠️ {error}</div>}

          <div className="products-header">
            <span className="products-count">
              Showing <strong>{paginatedProducts.length}</strong> of{" "}
              <strong>{filteredProducts.length}</strong> products
            </span>
          </div>

          {loading ? (
            <div className="skeleton-grid">
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="product-grid">
              {paginatedProducts.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <p>No products found for your filters.</p>
                </div>
              ) : (
                paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </main>
      </div>

      {/* Quick Preview Modal */}
      {previewProduct && (
        <QuickPreview
          product={previewProduct}
          onClose={() => setPreviewProduct(null)}
        />
      )}
    </>
  );
};

export default ProductList;
