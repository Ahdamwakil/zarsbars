import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function ProductCard({ product }) {
  const { addToCart, isLoading } = useCart()
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate()

  if (!product) return null

  // Handle both Shopify API data and static fallback data
  const variant = product.variants?.edges?.[0]?.node || (product.variantId ? { id: product.variantId, availableForSale: true } : null)
  const staticImage = product.image
  // Use local images only (prioritize static images over Shopify images)
  const image = staticImage ? { url: staticImage } : null
  const shopifyPrice = product.priceRange?.minVariantPrice
  const staticPrice = product.price
  const price = shopifyPrice || (staticPrice ? { amount: staticPrice.toString(), currencyCode: 'USD' } : null)

  const handleAddToCart = async (e) => {
    e.stopPropagation() // Prevent navigation when clicking button
    if (variant && variant.availableForSale && variant.id) {
      try {
        await addToCart(variant.id, 1)
      } catch (error) {
        console.error('Failed to add to cart:', error)
        alert('Failed to add item to cart. Please try again.')
      }
    }
  }

  const handleProductClick = () => {
    // Only navigate if product is available (not sold out and has variant)
    if (!product.soldOut && variant?.id) {
      const productId = product.shopifyId || product.id?.split('/').pop()
      navigate(`/product/${productId}`)
    }
  }

  const mainImageUrl = image ? image.url : null
  const hoverImageUrl = product.hoverImage || null

  return (
    <div 
      className="product-card"
      onClick={handleProductClick}
      style={{ cursor: (!product.soldOut && variant?.id) ? 'pointer' : 'default' }}
    >
      <div 
        className="product-image-wrapper"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {mainImageUrl && (
          <div 
            className="product-image product-image-base"
            style={{ backgroundImage: `url(${mainImageUrl})` }}
          ></div>
        )}
        {hoverImageUrl && (
          <div 
            className="product-image product-image-overlay"
            style={{ 
              backgroundImage: `url(${hoverImageUrl})`,
              opacity: isHovering ? 1 : 0
            }}
          ></div>
        )}
        {!mainImageUrl && !hoverImageUrl && (
          <div className="product-image"></div>
        )}
      </div>
      <div className="product-info">
        <p className="product-title">{product.title}</p>
        <p className="product-subtitle">{product.subtitle || ''}</p>
        <p className="product-price">
          {price ? `$${parseFloat(price.amount).toFixed(2)}` : '$0.00'}
        </p>
      </div>
      <button 
        className="product-add-button" 
        onClick={handleAddToCart}
        disabled={isLoading || !variant?.availableForSale || !variant?.id || product.soldOut}
      >
        {product.soldOut ? 'sold out' : (isLoading ? 'adding...' : 'add to bag')}
      </button>
    </div>
  )
}

export default ProductCard

