// Product data - can be fetched from Shopify or hardcoded
// For now, using product IDs from Shopify
export const products = [
  {
    id: 'gid://shopify/Product/7530457661534',
    shopifyId: '7530457661534',
    title: 'OG Bar',
    subtitle: 'Natural Shampoo Bar',
    price: 12.99,
    image: '/images/OG_bar.png',
    hoverImage: '/images/overlay1.jpg',
    variantId: null // Will be fetched from Shopify
  },
  {
    id: 'gid://shopify/Product/7480024137822',
    shopifyId: '7480024137822',
    title: 'Rumi Bar',
    subtitle: 'Natural Shampoo Bar',
    price: 12.99,
    image: '/images/Rumi_bar.png',
    hoverImage: '/images/overlay2.jpg',
    variantId: null // Will be fetched from Shopify
  },
  {
    id: 'gid://shopify/Product/YOUR_ALPHABET_BAR_PRODUCT_ID',
    shopifyId: 'YOUR_ALPHABET_BAR_PRODUCT_ID',
    title: 'Alphabet Bar',
    subtitle: 'Natural Shampoo Bar',
    price: 32.00,
    image: '/images/Alphabet.png',
    hoverImage: '/images/DTS_my_own_summer_Daniel_Farò_Photos_ID9732.jpg',
    variantId: null, // Will be fetched from Shopify
    soldOut: true
  },
  {
    id: 'gid://shopify/Product/YOUR_BLUE_MAGIC_BAR_PRODUCT_ID',
    shopifyId: 'YOUR_BLUE_MAGIC_BAR_PRODUCT_ID',
    title: 'Blue Magic Bar',
    subtitle: 'Natural Shampoo Bar',
    price: 32.00,
    image: '/images/bluemagic.png',
    hoverImage: '/images/DTS_OMW_Daniel_Farò_Photos_ID10435.jpg',
    variantId: null, // Will be fetched from Shopify
    soldOut: true
  }
]

