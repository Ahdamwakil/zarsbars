import { useCart } from '../context/CartContext'

function CartDrawer() {
  const { cart, isOpen, setIsOpen, isLoading, updateCartLine, removeFromCart, checkoutUrl } = useCart()

  if (!isOpen) return null

  const cartItems = cart?.lines?.edges || []
  const total = cart?.cost?.totalAmount

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsOpen(false)}></div>
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Cart</h2>
          <button className="cart-drawer-close" onClick={() => setIsOpen(false)}>×</button>
        </div>
        
        <div className="cart-drawer-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(({ node: item }) => {
                  const variant = item.merchandise
                  const product = variant.product
                  const image = product?.images?.edges?.[0]?.node
                  
                  return (
                    <div key={item.id} className="cart-item">
                      {image && (
                        <div 
                          className="cart-item-image"
                          style={{ backgroundImage: `url(${image.url})` }}
                        ></div>
                      )}
                      <div className="cart-item-details">
                        <p className="cart-item-title">{product?.title}</p>
                        <p className="cart-item-variant">{variant.title}</p>
                        <p className="cart-item-price">
                          ${parseFloat(variant.price.amount).toFixed(2)}
                        </p>
                      </div>
                      <div className="cart-item-actions">
                        <div className="cart-item-quantity">
                          <button 
                            onClick={() => updateCartLine(item.id, item.quantity - 1)}
                            disabled={isLoading}
                          >-</button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateCartLine(item.id, item.quantity + 1)}
                            disabled={isLoading}
                          >+</button>
                        </div>
                        <button 
                          className="cart-item-remove"
                          onClick={() => removeFromCart(item.id)}
                          disabled={isLoading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="cart-drawer-footer">
                <div className="cart-total">
                  <p>Total: <span>${total ? parseFloat(total.amount).toFixed(2) : '0.00'}</span></p>
                </div>
                <a 
                  href={checkoutUrl} 
                  className="cart-checkout-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Checkout
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default CartDrawer

