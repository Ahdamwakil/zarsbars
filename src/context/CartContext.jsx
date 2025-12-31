import { createContext, useContext, useState, useEffect } from 'react'
import { storefront, CREATE_CART, ADD_TO_CART, GET_CART, UPDATE_CART_LINES, REMOVE_FROM_CART } from '../lib/shopify'

const CartContext = createContext()

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem('shopify_cart_id')
    if (savedCartId) {
      loadCart(savedCartId)
    }
  }, [])

  const loadCart = async (cartId) => {
    try {
      const data = await storefront(GET_CART, { id: cartId })
      if (data.cart) {
        setCart(data.cart)
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      localStorage.removeItem('shopify_cart_id')
    }
  }

  const createCart = async () => {
    try {
      const data = await storefront(CREATE_CART, { input: {} })
      if (data.cartCreate?.cart) {
        const newCart = data.cartCreate.cart
        setCart(newCart)
        localStorage.setItem('shopify_cart_id', newCart.id)
        return newCart
      }
    } catch (error) {
      console.error('Error creating cart:', error)
      throw error
    }
  }

  const addToCart = async (variantId, quantity = 1) => {
    setIsLoading(true)
    try {
      let currentCart = cart
      
      // Create cart if it doesn't exist
      if (!currentCart) {
        currentCart = await createCart()
      }

      const data = await storefront(ADD_TO_CART, {
        cartId: currentCart.id,
        lines: [{ merchandiseId: variantId, quantity }]
      })

      if (data.cartLinesAdd?.cart) {
        setCart(data.cartLinesAdd.cart)
        setIsOpen(true) // Open cart when item is added
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateCartLine = async (lineId, quantity) => {
    setIsLoading(true)
    try {
      const data = await storefront(UPDATE_CART_LINES, {
        cartId: cart.id,
        lines: [{ id: lineId, quantity }]
      })

      if (data.cartLinesUpdate?.cart) {
        setCart(data.cartLinesUpdate.cart)
      }
    } catch (error) {
      console.error('Error updating cart:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (lineId) => {
    setIsLoading(true)
    try {
      const data = await storefront(REMOVE_FROM_CART, {
        cartId: cart.id,
        lineIds: [lineId]
      })

      if (data.cartLinesRemove?.cart) {
        setCart(data.cartLinesRemove.cart)
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getCartItemCount = () => {
    if (!cart?.lines?.edges) return 0
    return cart.lines.edges.reduce((total, edge) => total + edge.node.quantity, 0)
  }

  const value = {
    cart,
    isOpen,
    setIsOpen,
    isLoading,
    addToCart,
    updateCartLine,
    removeFromCart,
    getCartItemCount,
    checkoutUrl: cart?.checkoutUrl
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

