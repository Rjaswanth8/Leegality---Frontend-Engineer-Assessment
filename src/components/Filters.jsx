import { useState, useEffect } from "react";
import "../styles/filters.css";

const SHOW_LIMIT = 7;

/* ── Reusable custom checkbox row ── */
const CheckboxItem = ({ checked, onChange, label, accent = false }) => (
  <label className={`cb-item ${checked ? "cb-checked" : ""}`}>
    <input type="checkbox" checked={checked} onChange={onChange} />

    {/* Custom visual box */}
    <span className="cb-box">
      <svg
        className="cb-check-svg"
        width="9"
        height="7"
        viewBox="0 0 10 8"
        fill="none"
      >
        <path
          d="M1 3.5L3.8 6.5L9 1"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>

    {/* Brand accent dot */}
    {accent && <span className="brand-dot" />}

    <span className="cb-label">{label}</span>
  </label>
);

/* ── Main Filters component ── */
const Filters = ({
  categories,
  selectedCategories,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceApply,
  brands,
  selectedBrands,
  onBrandChange,
  onClearAll,
}) => {
  const [localMin,      setLocalMin]      = useState(minPrice);
  const [localMax,      setLocalMax]      = useState(maxPrice);
  const [showAllCats,   setShowAllCats]   = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [catsOpen,      setCatsOpen]      = useState(true);
  const [priceOpen,     setPriceOpen]     = useState(true);
  const [brandsOpen,    setBrandsOpen]    = useState(true);

  useEffect(() => { setLocalMin(minPrice); }, [minPrice]);
  useEffect(() => { setLocalMax(maxPrice); }, [maxPrice]);

  const toggleCategory = (slug) =>
    onCategoryChange(
      selectedCategories.includes(slug)
        ? selectedCategories.filter((c) => c !== slug)
        : [...selectedCategories, slug]
    );

  const toggleBrand = (brand) =>
    onBrandChange(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]
    );

  const clearMin = () => { setLocalMin(""); onPriceApply("", localMax); };
  const clearMax = () => { setLocalMax(""); onPriceApply(localMin, ""); };

  const visibleCats   = showAllCats   ? categories : categories.slice(0, SHOW_LIMIT);
  const visibleBrands = showAllBrands ? brands      : brands.slice(0, SHOW_LIMIT);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    localMin !== "" ||
    localMax !== "";

  return (
    <aside className="filters-panel">

      {/* ══ CATEGORIES ══ */}
      <div className="filter-block">
        <div className="filter-section-head" onClick={() => setCatsOpen((v) => !v)}>
          <span className="filter-section-title">Categories</span>
          <span className="filter-section-right">
            {selectedCategories.length > 0 && (
              <span className="filter-section-count">{selectedCategories.length}</span>
            )}
            <span className={`filter-chevron ${catsOpen ? "open" : ""}`}>▼</span>
          </span>
        </div>

        {catsOpen && (
          <>
            <div className="cb-list">
              {visibleCats.map((cat) => (
                <CheckboxItem
                  key={cat.slug}
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  label={cat.name}
                />
              ))}
            </div>

            {categories.length > SHOW_LIMIT && (
              <button
                className="show-more-btn"
                onClick={() => setShowAllCats((v) => !v)}
              >
                {showAllCats
                  ? "▲ Show less"
                  : `▼ Show ${categories.length - SHOW_LIMIT} more`}
              </button>
            )}
          </>
        )}
      </div>

      {/* ══ PRICE RANGE ══ */}
      <div className="filter-block">
        <div className="filter-section-head" onClick={() => setPriceOpen((v) => !v)}>
          <span className="filter-section-title">Price Range</span>
          <span className="filter-section-right">
            {(localMin !== "" || localMax !== "") && (
              <span className="filter-section-count">✓</span>
            )}
            <span className={`filter-chevron ${priceOpen ? "open" : ""}`}>▼</span>
          </span>
        </div>

        {priceOpen && (
          <>
            <div className="price-row">
              <div className="price-field">
                <span className="price-field-label">Min</span>
                <div className="price-input-wrap">
                  <span className="price-input-prefix">$</span>
                  <input
                    className="price-input"
                    type="number"
                    placeholder="0"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                    min="0"
                  />
                  {localMin !== "" && (
                    <button className="price-clear-btn" onClick={clearMin} type="button">×</button>
                  )}
                </div>
              </div>

              <div className="price-field">
                <span className="price-field-label">Max</span>
                <div className="price-input-wrap">
                  <span className="price-input-prefix">$</span>
                  <input
                    className="price-input"
                    type="number"
                    placeholder="Any"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                    min="0"
                  />
                  {localMax !== "" && (
                    <button className="price-clear-btn" onClick={clearMax} type="button">×</button>
                  )}
                </div>
              </div>
            </div>

            <button
              className="apply-btn"
              onClick={() => onPriceApply(localMin, localMax)}
            >
              Apply Price Filter
            </button>
          </>
        )}
      </div>

      {/* ══ BRANDS ══ */}
      {brands.length > 0 && (
        <div className="filter-block">
          <div className="filter-section-head" onClick={() => setBrandsOpen((v) => !v)}>
            <span className="filter-section-title">Brands</span>
            <span className="filter-section-right">
              {selectedBrands.length > 0 && (
                <span className="filter-section-count">{selectedBrands.length}</span>
              )}
              <span className={`filter-chevron ${brandsOpen ? "open" : ""}`}>▼</span>
            </span>
          </div>

          {brandsOpen && (
            <>
              <div className="cb-list">
                {visibleBrands.map((brand) => (
                  <CheckboxItem
                    key={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    label={brand}
                    accent
                  />
                ))}
              </div>

              {brands.length > SHOW_LIMIT && (
                <button
                  className="show-more-btn"
                  onClick={() => setShowAllBrands((v) => !v)}
                >
                  {showAllBrands
                    ? "▲ Show less"
                    : `▼ Show ${brands.length - SHOW_LIMIT} more`}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* ══ CLEAR ALL ══ */}
      {hasActiveFilters && (
        <div className="clear-all-wrap">
          <button className="clear-filters-btn" onClick={onClearAll}>
            ✕ Clear All Filters
          </button>
        </div>
      )}

    </aside>
  );
};

export default Filters;
