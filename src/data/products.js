// Product data - can be fetched from Shopify or hardcoded
// For now, using product IDs from Shopify
export const products = [
  {
    id: 'gid://shopify/Product/7480024137822',
    shopifyId: '7480024137822',
    title: 'OG Bar',
    subtitle: 'Natural Shampoo Bar',
    price: 12.99,
    image: '/images/OG_bar.png',
    hoverImage: '/images/overlay1.jpg',
    variantId: null // Will be fetched from Shopify
  },
  {
    id: 'gid://shopify/Product/YOUR_RUMI_BAR_PRODUCT_ID',
    shopifyId: 'YOUR_RUMI_BAR_PRODUCT_ID',
    title: 'Rumi Bar',
    subtitle: 'Natural Shampoo Bar',
    price: 12.99,
    image: '/images/Rumi_bar.png',
    hoverImage: '/images/overlay2.jpg',
    variantId: null // Will be fetched from Shopify
  }
]

