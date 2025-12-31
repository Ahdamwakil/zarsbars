import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import CartDrawer from '../components/CartDrawer'
import { products } from '../data/products'
import { useEffect, useState } from 'react'
import { storefront, GET_PRODUCT } from '../lib/shopify'
import './ShopAll.css'

function ShopAll() {
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
                  subtitle: product.subtitle,
                  hoverImage: product.hoverImage
                }
              }
              return product
            } catch (error) {
              console.error(`Error fetching product ${product.id}:`, error)
              return product
            }
          })
        )
        setProductData(fetchedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
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
          <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>zarsbars</div>
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
      
      <div className="shop-all-page">
        <div className="shop-all-header">
          <h1 className="shop-all-title">shampoo bars</h1>
        </div>
        
        <div className="shop-all-products">
          {productData.length > 0 ? (
            productData.map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))
          ) : (
            products.map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))
          )}
        </div>
      </div>
      
      <CartDrawer />
    </div>
  )
}

export default ShopAll

