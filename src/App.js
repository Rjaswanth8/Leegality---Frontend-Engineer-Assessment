import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShopProvider } from "./ShopContext";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </ShopProvider>
  );
}

export default App;
