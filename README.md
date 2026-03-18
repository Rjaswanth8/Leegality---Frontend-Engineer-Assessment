# ShopEasy — Product Listing App

A React-based e-commerce product listing app built as part of the Leegality Frontend Engineering Assessment.

---

## Getting Started

Clone the repo, install dependencies, and run the dev server:

```bash
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

---

## What it does

The app has two pages:

**Product Listing** — Shows products in a 4-column grid with a sidebar for filtering. You can filter by category, price range, and brand, and all three filters stack together. Pagination resets whenever you change a filter. Clicking a product card opens a quick preview popup, or you can click through to the full detail page.

**Product Detail** — Full page for a single product with an image gallery, stock status, discount badge, and a quantity selector. Has an Add to Cart and Wishlist button that both reflect immediately in the navbar icons.

---

## Project structure

```
src/
  components/
    Navbar.jsx        — sticky navbar with cart, wishlist and profile slide-in panels
    Filters.jsx       — sidebar with category chips, price range, brand chips
    ProductCard.jsx   — card component + the QuickPreview modal
    Pagination.jsx    — numbered pagination with prev/next
  pages/
    ProductList.jsx   — listing page, owns all filter state
    ProductDetail.jsx — detail page, handles qty and cart/wishlist actions
  services/
    api.js            — all fetch calls to dummyjson.com
  ShopContext.js      — React Context for cart and wishlist state
  index.css           — global CSS variables and resets
  styles/             — per-component CSS files
```

---

## A few decisions I made

**Client-side filtering for most cases.** The API supports fetching by category but not by brand or price. Rather than making 3 separate API calls, I fetch all products once and filter client-side. For a single category selection I use the category endpoint since it's more specific; for multiple categories I fall back to the full list and filter in memory. This keeps the filter experience fast and responsive.

**sessionStorage for filter persistence.** When you click into a product detail and hit Back, your filters are still applied. I used sessionStorage (not localStorage) so they clear when you close the tab — it's a shopping session, not a permanent preference.

**QuickPreview via custom DOM event.** The preview button is inside ProductCard, but the modal needs to sit outside the card's stacking context to render correctly. Rather than lifting preview state all the way up through props, I dispatch a custom window event from the card and listen for it in ProductList. It's a small indirection but keeps the card component clean.

**No heavy UI library.** Everything is plain CSS with custom properties for the design tokens. The filter chips, slide-in panels, modal, and skeletons are all hand-built. It felt wrong to pull in a full component library for something this focused.

---

## What I'd add with more time

- Debounce the search input — right now every keystroke fires an API call
- A sort control (price, rating, newest)
- Persist cart and wishlist to localStorage so they survive a page refresh
- Unit tests for the filtering logic and the context
- Proper mobile layout — the sidebar collapses awkwardly on small screens
- A proper checkout flow, even a mock one, to make the cart feel complete
