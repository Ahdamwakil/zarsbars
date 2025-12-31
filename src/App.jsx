import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import ShopAll from './pages/ShopAll'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/shop-all" element={<ShopAll />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
