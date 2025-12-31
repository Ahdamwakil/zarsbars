import { useNavigate } from 'react-router-dom'
import { CartProvider, useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import CartDrawer from '../components/CartDrawer'
import { products } from '../data/products'
import { useEffect, useState } from 'react'
import { storefront, GET_PRODUCT } from '../lib/shopify'

function HomeContent() {
  const navigate = useNavigate()
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
          <p>We aren't fake, we're natural</p>
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
              <button 
                className="navbar-dropdown-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  navigate('/shop-all')
                }}
              >
                shampoo bars
              </button>
            </div>
            <div className="navbar-dropdown">
              <a 
                href="https://punchup.live/zarthestar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="navbar-dropdown-btn"
                style={{ textDecoration: 'none' }}
              >
                zar the star
              </a>
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
          <p className="hero-textbox-text">Start your natural beauty ritual today</p>
          <p className="hero-textbox-subtext">Let zarsbars be a part of your daily hair care routine.</p>
          <button 
            className="hero-shop-button"
            onClick={() => navigate('/shop-all')}
          >
            Shop now
          </button>
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
        </div>
      </section>
      
      <CartDrawer />
    </div>
  )
}

function Home() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  )
}

export default Home

