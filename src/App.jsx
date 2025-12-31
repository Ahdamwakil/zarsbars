import './App.css'
import { CartProvider, useCart } from './context/CartContext'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'
import { products } from './data/products'
import { useEffect, useState } from 'react'
import { storefront, GET_PRODUCT } from './lib/shopify'

function AppContent() {
  const { setIsOpen, getCartItemCount } = useCart()
  const [productData, setProductData] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Fetch product data from Shopify
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true)
      try {
        const fetchedProducts = await Promise.all(
          products.map(async (product) => {
            try {
              const data = await storefront(GET_PRODUCT, { 
                id: product.id 
              })
              if (data.product) {
                return {
                  ...product,
                  ...data.product,
                  variantId: data.product.variants?.edges?.[0]?.node?.id,
                  subtitle: product.subtitle, // Preserve custom subtitle
                  hoverImage: product.hoverImage // Preserve hover image
                }
              }
              return product
            } catch (error) {
              console.error(`Error fetching product ${product.id}:`, error)
              // Return static product data as fallback
              return product
            }
          })
        )
        setProductData(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to static products
        setProductData(products)
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="App">
      <div className="sticky-header">
        <div className="announcement-bar">
          <p>Free shipping on orders over $50</p>
        </div>
        <nav className="navbar">
          <div className="navbar-brand">zarsbars.</div>
          <button 
            className="navbar-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            menu
          </button>
          <div className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu-open' : ''}`}>
            <div className="navbar-dropdown">
              <button className="navbar-dropdown-btn">shampoo bars</button>
            </div>
            <div className="navbar-dropdown">
              <button className="navbar-dropdown-btn">merch</button>
            </div>
          </div>
          <div 
            className="navbar-cart" 
            onClick={() => setIsOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            cart {getCartItemCount() > 0 && `(${getCartItemCount()})`}
          </div>
        </nav>
      </div>
      
      <div className="hero">
        <div className="hero-textbox">
          <p className="hero-textbox-label">NEW YEAR NEW HAIR</p>
          <p className="hero-textbox-text">Get free shipping on orders over $50</p>
          <p className="hero-textbox-subtext">Let zarsbars be a part of your daily hair care ritual.</p>
          <button className="hero-shop-button">Shop now</button>
        </div>
      </div>
      
      <section className="products-section">
        <h2 className="products-section-title">SHOP ALL</h2>
        <div className="products-container">
          {productData.length > 0 ? (
            productData.map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))
          ) : (
            // Fallback to static products while loading
            products.map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))
          )}
          {/* Placeholder products */}
          <div className="product-card">
            <div className="product-image-wrapper">
              <div className="product-image"></div>
            </div>
            <div className="product-info">
              <p className="product-title">Product Title</p>
              <p className="product-subtitle">Product Subtitle</p>
              <p className="product-price">$XX.XX</p>
            </div>
            <button className="product-add-button" disabled>add to bag</button>
          </div>
          <div className="product-card">
            <div className="product-image-wrapper">
              <div className="product-image"></div>
            </div>
            <div className="product-info">
              <p className="product-title">Product Title</p>
              <p className="product-subtitle">Product Subtitle</p>
              <p className="product-price">$XX.XX</p>
            </div>
            <button className="product-add-button" disabled>add to bag</button>
          </div>
        </div>
      </section>
      
      <CartDrawer />
    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}

export default App
