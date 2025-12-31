import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { products } from '../data/products'
import { useEffect, useState } from 'react'
import { storefront, GET_PRODUCT } from '../lib/shopify'
import CartDrawer from '../components/CartDrawer'
import './ProductDetail.css'

function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addToCart, setIsOpen, isLoading, getCartItemCount } = useCart()
  const [product, setProduct] = useState(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoadingProduct(true)
      // Find product in static data first
      const staticProduct = products.find(p => 
        p.shopifyId === productId || p.id === productId
      )

      if (staticProduct) {
        // Try to fetch from Shopify, fallback to static
        try {
          const data = await storefront(GET_PRODUCT, { id: staticProduct.id })
          if (data.product) {
            setProduct({
              ...staticProduct,
              ...data.product,
              variantId: data.product.variants?.edges?.[0]?.node?.id,
              subtitle: staticProduct.subtitle,
              hoverImage: staticProduct.hoverImage,
              description: data.product.description || staticProduct.description || ''
            })
          } else {
            setProduct(staticProduct)
          }
        } catch (error) {
          console.error('Error fetching product:', error)
          setProduct(staticProduct)
        }
      } else {
        navigate('/')
      }
      setIsLoadingProduct(false)
    }

    loadProduct()
  }, [productId, navigate])

  const handleAddToCart = async () => {
    const variant = product?.variants?.edges?.[0]?.node || (product?.variantId ? { id: product.variantId, availableForSale: true } : null)
    
    if (variant && variant.availableForSale && variant.id) {
      try {
        await addToCart(variant.id, 1)
        setIsOpen(true)
      } catch (error) {
        console.error('Failed to add to cart:', error)
        alert('Failed to add item to cart. Please try again.')
      }
    }
  }

  if (isLoadingProduct || !product) {
    return (
      <div className="product-detail-loading">
        <p>Loading...</p>
      </div>
    )
  }

  const variant = product.variants?.edges?.[0]?.node || (product.variantId ? { id: product.variantId, availableForSale: true } : null)
  const image = product.image ? { url: product.image } : (product.images?.edges?.[0]?.node || null)
  const price = product.priceRange?.minVariantPrice || (product.price ? { amount: product.price.toString(), currencyCode: 'USD' } : null)

  return (
    <div className="App">
      <div className="sticky-header">
        <div className="announcement-bar">
          <p>We aren't fake, we're natural</p>
        </div>
        <nav className="navbar">
          <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>zarsbars.</div>
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

      <div className="product-detail">
        <button className="product-detail-back" onClick={() => navigate(-1)}>
          ← back
        </button>
        
        <div className="product-detail-container">
          <div className="product-detail-image-section">
            {image && (
              <div 
                className="product-detail-image"
                style={{ backgroundImage: `url(${image.url})` }}
              ></div>
            )}
          </div>
          
          <div className="product-detail-info">
            <h1 className="product-detail-title">{product.title}</h1>
            {product.subtitle && (
              <p className="product-detail-subtitle">{product.subtitle}</p>
            )}
            <p className="product-detail-price">
              {price ? `$${parseFloat(price.amount).toFixed(2)}` : '$0.00'}
            </p>
            
            {product.description && (
              <div className="product-detail-description">
                <p>{product.description}</p>
              </div>
            )}
            
            <button
              className="product-detail-add-button"
              onClick={handleAddToCart}
              disabled={isLoading || !variant?.availableForSale || !variant?.id || product.soldOut}
            >
              {product.soldOut ? 'sold out' : (isLoading ? 'adding...' : 'add to bag')}
            </button>
          </div>
        </div>
      </div>
      <CartDrawer />
    </div>
  )
}

export default ProductDetail

