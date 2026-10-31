import { USE_MOCK, API_BASE_URL } from '../config';
import { Product, StoreOffer, PricePoint, PriceRange, Tracker, CreateTrackerPayload } from '../types';

// High-fidelity image assets generated for PriceRadar
const SONY_HEADPHONES_IMG = '/src/assets/images/priceradar_sony_headphones_1793426876548.jpg';
const IPHONE_15_IMG = '/src/assets/images/priceradar_iphone_product_1793426876876.jpg';
const PS5_SLIM_IMG = '/src/assets/images/priceradar_ps5_console_1793426877339.jpg';

// Pre-configured mock products catalog
const MOCK_PRODUCTS: Record<string, { product: Product; offers: StoreOffer[] }> = {
  sony: {
    product: {
      id: 'prod_sony_wh1000xm5',
      title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Midnight Black',
      brand: 'Sony',
      model: 'WH-1000XM5/B',
      category: 'Electronics & Audio',
      imageUrl: SONY_HEADPHONES_IMG,
      rating: 4.8,
      reviewCount: 14280,
      matchConfidence: 98,
      description: 'Industry-leading noise cancellation with two processors and 8 microphones. Up to 30 hours battery life with quick charging.',
      specs: {
        'Battery Life': '30 Hours',
        'Noise Cancellation': 'Dual-chip Auto NC Optimizer',
        'Bluetooth': 'v5.2 with LDAC & AAC',
        'Weight': '250g Ultra-lightweight',
        'Warranty': '1 Year Manufacturer',
      },
    },
    offers: [
      {
        id: 'offer_walmart_sony',
        storeName: 'Walmart',
        storeKey: 'walmart',
        storeDomain: 'walmart.com',
        price: 328.00,
        originalPrice: 399.99,
        discountPercent: 18,
        shippingCost: 0,
        shippingText: 'Free 2-day delivery',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Arrives in 2 business days',
        sellerRating: 4.7,
        sellerReviews: 45200,
        productUrl: 'https://www.walmart.com',
        isBestPrice: true,
        verifiedSeller: true,
        badge: 'Lowest Price',
      },
      {
        id: 'offer_amazon_sony',
        storeName: 'Amazon',
        storeKey: 'amazon',
        storeDomain: 'amazon.com',
        price: 339.99,
        originalPrice: 399.99,
        discountPercent: 15,
        shippingCost: 0,
        shippingText: 'Free Prime shipping',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Arrives tomorrow by 9 PM',
        sellerRating: 4.9,
        sellerReviews: 89300,
        productUrl: 'https://www.amazon.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_bestbuy_sony',
        storeName: 'Best Buy',
        storeKey: 'bestbuy',
        storeDomain: 'bestbuy.com',
        price: 349.99,
        originalPrice: 399.99,
        discountPercent: 13,
        shippingCost: 0,
        shippingText: 'Free standard shipping',
        inStock: true,
        stockStatus: 'In Stock (Pickup today)',
        deliveryEstimate: 'Pickup ready in 1 hour or ship in 3 days',
        sellerRating: 4.8,
        sellerReviews: 31200,
        productUrl: 'https://www.bestbuy.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_target_sony',
        storeName: 'Target',
        storeKey: 'target',
        storeDomain: 'target.com',
        price: 359.99,
        originalPrice: 399.99,
        discountPercent: 10,
        shippingCost: 0,
        shippingText: 'Free RedCard shipping',
        inStock: true,
        stockStatus: 'Only 4 left in stock',
        deliveryEstimate: 'Arrives Friday',
        sellerRating: 4.6,
        sellerReviews: 18400,
        productUrl: 'https://www.target.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_ebay_sony',
        storeName: 'eBay',
        storeKey: 'ebay',
        storeDomain: 'ebay.com',
        price: 319.50,
        originalPrice: 399.99,
        discountPercent: 20,
        shippingCost: 9.99,
        shippingText: '$9.99 Expedited',
        inStock: true,
        stockStatus: 'Only 2 available',
        deliveryEstimate: 'Estimated delivery 4-6 business days',
        sellerRating: 4.5,
        sellerReviews: 4890,
        productUrl: 'https://www.ebay.com',
        isBestPrice: false,
        verifiedSeller: false,
      },
      {
        id: 'offer_newegg_sony',
        storeName: 'Newegg',
        storeKey: 'newegg',
        storeDomain: 'newegg.com',
        price: 369.99,
        originalPrice: 399.99,
        discountPercent: 8,
        shippingCost: 4.99,
        shippingText: '$4.99 3-Day Ground',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Ships within 24 hours',
        sellerRating: 4.6,
        sellerReviews: 12100,
        productUrl: 'https://www.newegg.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_aliexpress_sony',
        storeName: 'AliExpress',
        storeKey: 'aliexpress',
        storeDomain: 'aliexpress.com',
        price: 345.00,
        originalPrice: 420.00,
        discountPercent: 17,
        shippingCost: 0,
        shippingText: 'Free Choice Shipping',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Estimated delivery 8-12 days',
        sellerRating: 4.4,
        sellerReviews: 2980,
        productUrl: 'https://www.aliexpress.com',
        isBestPrice: false,
        verifiedSeller: false,
      },
      {
        id: 'offer_daraz_sony',
        storeName: 'Daraz',
        storeKey: 'daraz',
        storeDomain: 'daraz.pk',
        price: 379.00,
        originalPrice: 410.00,
        discountPercent: 7,
        shippingCost: 6.50,
        shippingText: '$6.50 Standard Shipping',
        inStock: false,
        stockStatus: 'Backorder (Ships Nov 12)',
        deliveryEstimate: 'Ships in 7-10 days',
        sellerRating: 4.3,
        sellerReviews: 1450,
        productUrl: 'https://www.daraz.pk',
        isBestPrice: false,
        verifiedSeller: true,
      },
    ],
  },

  iphone: {
    product: {
      id: 'prod_apple_iphone15pro',
      title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium (Unlocked)',
      brand: 'Apple',
      model: 'A3106 Titanium',
      category: 'Smartphones & Mobile',
      imageUrl: IPHONE_15_IMG,
      rating: 4.9,
      reviewCount: 38920,
      matchConfidence: 99,
      description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever.',
      specs: {
        'Display': '6.7-inch Super Retina XDR OLED 120Hz',
        'Chip': 'A17 Pro with 6-core GPU',
        'Storage': '256GB NVMe',
        'Camera': '48MP Main | 5x Optical Telephoto',
        'Connectivity': 'USB-C (10Gbps) / 5G / Wi-Fi 6E',
      },
    },
    offers: [
      {
        id: 'offer_bestbuy_iphone',
        storeName: 'Best Buy',
        storeKey: 'bestbuy',
        storeDomain: 'bestbuy.com',
        price: 1099.99,
        originalPrice: 1199.99,
        discountPercent: 8,
        shippingCost: 0,
        shippingText: 'Free Next-Day Delivery',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Arrives tomorrow',
        sellerRating: 4.9,
        sellerReviews: 62400,
        productUrl: 'https://www.bestbuy.com',
        isBestPrice: true,
        verifiedSeller: true,
        badge: 'Lowest Price',
      },
      {
        id: 'offer_amazon_iphone',
        storeName: 'Amazon',
        storeKey: 'amazon',
        storeDomain: 'amazon.com',
        price: 1149.00,
        originalPrice: 1199.99,
        discountPercent: 4,
        shippingCost: 0,
        shippingText: 'Free Prime delivery',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Arrives in 2 business days',
        sellerRating: 4.8,
        sellerReviews: 76500,
        productUrl: 'https://www.amazon.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_walmart_iphone',
        storeName: 'Walmart',
        storeKey: 'walmart',
        storeDomain: 'walmart.com',
        price: 1129.99,
        originalPrice: 1199.99,
        discountPercent: 6,
        shippingCost: 0,
        shippingText: 'Free 2-day delivery',
        inStock: true,
        stockStatus: 'Only 3 left in stock',
        deliveryEstimate: 'Arrives Friday',
        sellerRating: 4.7,
        sellerReviews: 38900,
        productUrl: 'https://www.walmart.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_target_iphone',
        storeName: 'Target',
        storeKey: 'target',
        storeDomain: 'target.com',
        price: 1189.99,
        originalPrice: 1199.99,
        discountPercent: 1,
        shippingCost: 0,
        shippingText: 'Free Shipping',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Arrives Monday',
        sellerRating: 4.7,
        sellerReviews: 24100,
        productUrl: 'https://www.target.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_ebay_iphone',
        storeName: 'eBay',
        storeKey: 'ebay',
        storeDomain: 'ebay.com',
        price: 1089.00,
        originalPrice: 1199.99,
        discountPercent: 9,
        shippingCost: 18.00,
        shippingText: '$18.00 Insured Shipping',
        inStock: true,
        stockStatus: '1 left (Top Rated Plus)',
        deliveryEstimate: 'Arrives in 3-5 days',
        sellerRating: 4.9,
        sellerReviews: 8120,
        productUrl: 'https://www.ebay.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_newegg_iphone',
        storeName: 'Newegg',
        storeKey: 'newegg',
        storeDomain: 'newegg.com',
        price: 1179.99,
        originalPrice: 1199.99,
        discountPercent: 2,
        shippingCost: 0,
        shippingText: 'Free Standard',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Ships in 1-2 days',
        sellerRating: 4.6,
        sellerReviews: 18500,
        productUrl: 'https://www.newegg.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_aliexpress_iphone',
        storeName: 'AliExpress',
        storeKey: 'aliexpress',
        storeDomain: 'aliexpress.com',
        price: 1199.00,
        originalPrice: 1250.00,
        discountPercent: 4,
        shippingCost: 12.00,
        shippingText: '$12.00 Global Priority',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Estimated 10-14 days',
        sellerRating: 4.5,
        sellerReviews: 3200,
        productUrl: 'https://www.aliexpress.com',
        isBestPrice: false,
        verifiedSeller: false,
      },
      {
        id: 'offer_daraz_iphone',
        storeName: 'Daraz',
        storeKey: 'daraz',
        storeDomain: 'daraz.pk',
        price: 1210.00,
        originalPrice: 1280.00,
        discountPercent: 5,
        shippingCost: 0,
        shippingText: 'Free DarazMall Delivery',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Arrives in 4-6 days',
        sellerRating: 4.4,
        sellerReviews: 2190,
        productUrl: 'https://www.daraz.pk',
        isBestPrice: false,
        verifiedSeller: true,
      },
    ],
  },

  ps5: {
    product: {
      id: 'prod_sony_ps5slim',
      title: 'Sony PlayStation 5 Slim Edition Console 1TB - White with DualSense Controller',
      brand: 'Sony Interactive',
      model: 'CFI-2000 Slim',
      category: 'Video Games & Consoles',
      imageUrl: PS5_SLIM_IMG,
      rating: 4.9,
      reviewCount: 29400,
      matchConfidence: 97,
      description: 'The slim design packs powerful gaming tech inside a compact console with 1TB SSD storage, ray tracing, and ultra-high speed SSD load times.',
      specs: {
        'Storage': '1TB Custom High-Speed NVMe SSD',
        'Resolution': 'Up to 4K 120Hz & 8K HDR Support',
        'Audio': 'Tempest 3D AudioTech',
        'Controller': 'DualSense with Haptic Feedback',
      },
    },
    offers: [
      {
        id: 'offer_amazon_ps5',
        storeName: 'Amazon',
        storeKey: 'amazon',
        storeDomain: 'amazon.com',
        price: 449.00,
        originalPrice: 499.99,
        discountPercent: 10,
        shippingCost: 0,
        shippingText: 'Free Prime delivery',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Arrives Thursday',
        sellerRating: 4.9,
        sellerReviews: 78900,
        productUrl: 'https://www.amazon.com',
        isBestPrice: true,
        verifiedSeller: true,
        badge: 'Lowest Price',
      },
      {
        id: 'offer_bestbuy_ps5',
        storeName: 'Best Buy',
        storeKey: 'bestbuy',
        storeDomain: 'bestbuy.com',
        price: 449.99,
        originalPrice: 499.99,
        discountPercent: 10,
        shippingCost: 0,
        shippingText: 'Free 2-day delivery',
        inStock: true,
        stockStatus: 'In Stock (Pickup today)',
        deliveryEstimate: 'Pickup ready in 1 hour',
        sellerRating: 4.8,
        sellerReviews: 41200,
        productUrl: 'https://www.bestbuy.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_walmart_ps5',
        storeName: 'Walmart',
        storeKey: 'walmart',
        storeDomain: 'walmart.com',
        price: 469.00,
        originalPrice: 499.99,
        discountPercent: 6,
        shippingCost: 0,
        shippingText: 'Free Shipping',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Arrives in 3 business days',
        sellerRating: 4.7,
        sellerReviews: 35100,
        productUrl: 'https://www.walmart.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_target_ps5',
        storeName: 'Target',
        storeKey: 'target',
        storeDomain: 'target.com',
        price: 479.99,
        originalPrice: 499.99,
        discountPercent: 4,
        shippingCost: 0,
        shippingText: 'Free Shipping',
        inStock: true,
        stockStatus: 'Only 2 left',
        deliveryEstimate: 'Arrives Saturday',
        sellerRating: 4.6,
        sellerReviews: 21400,
        productUrl: 'https://www.target.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_ebay_ps5',
        storeName: 'eBay',
        storeKey: 'ebay',
        storeDomain: 'ebay.com',
        price: 439.00,
        originalPrice: 499.99,
        discountPercent: 12,
        shippingCost: 15.00,
        shippingText: '$15.00 Standard Shipping',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Arrives in 4-7 days',
        sellerRating: 4.6,
        sellerReviews: 9200,
        productUrl: 'https://www.ebay.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_newegg_ps5',
        storeName: 'Newegg',
        storeKey: 'newegg',
        storeDomain: 'newegg.com',
        price: 489.99,
        originalPrice: 499.99,
        discountPercent: 2,
        shippingCost: 0,
        shippingText: 'Free Shipping',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Ships in 1-2 days',
        sellerRating: 4.6,
        sellerReviews: 14200,
        productUrl: 'https://www.newegg.com',
        isBestPrice: false,
        verifiedSeller: true,
      },
      {
        id: 'offer_aliexpress_ps5',
        storeName: 'AliExpress',
        storeKey: 'aliexpress',
        storeDomain: 'aliexpress.com',
        price: 475.00,
        originalPrice: 510.00,
        discountPercent: 7,
        shippingCost: 9.99,
        shippingText: '$9.99 Express',
        inStock: true,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Estimated 8-12 days',
        sellerRating: 4.4,
        sellerReviews: 1890,
        productUrl: 'https://www.aliexpress.com',
        isBestPrice: false,
        verifiedSeller: false,
      },
      {
        id: 'offer_daraz_ps5',
        storeName: 'Daraz',
        storeKey: 'daraz',
        storeDomain: 'daraz.pk',
        price: 490.00,
        originalPrice: 520.00,
        discountPercent: 6,
        shippingCost: 0,
        shippingText: 'Free Shipping',
        inStock: false,
        stockStatus: 'Temporarily Out of Stock',
        deliveryEstimate: 'Pre-order for restock',
        sellerRating: 4.5,
        sellerReviews: 1250,
        productUrl: 'https://www.daraz.pk',
        isBestPrice: false,
        verifiedSeller: true,
      },
    ],
  },
};

// Initial Seed Trackers in LocalStorage if not present
const STORAGE_KEY_TRACKERS = 'priceradar_user_trackers_v1';

function getStoredTrackers(): Tracker[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRACKERS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading trackers from storage', e);
  }

  // Realistic initial seeded trackers for the user
  const initialTrackers: Tracker[] = [
    {
      id: 'trk_seed_1',
      email: 'shopper@example.com',
      productId: 'prod_sony_wh1000xm5',
      product: MOCK_PRODUCTS.sony.product,
      mode: 'drop',
      targetPrice: 330,
      initialPrice: 399.99,
      currentLowestPrice: 328.00,
      priceChange: -71.99,
      priceChangePercent: -18,
      sparklineData: [399.99, 389.0, 379.5, 360.0, 350.0, 339.99, 328.0],
      active: true,
      createdAt: '2026-10-18T10:30:00Z',
      lastCheckedAt: '12 minutes ago',
      bestStoreName: 'Walmart',
    },
    {
      id: 'trk_seed_2',
      email: 'shopper@example.com',
      productId: 'prod_apple_iphone15pro',
      product: MOCK_PRODUCTS.iphone.product,
      mode: 'target',
      targetPrice: 1100,
      initialPrice: 1199.99,
      currentLowestPrice: 1099.99,
      priceChange: -100.0,
      priceChangePercent: -8.3,
      sparklineData: [1199.99, 1189.0, 1175.0, 1149.0, 1130.0, 1115.0, 1099.99],
      active: true,
      createdAt: '2026-10-24T14:15:00Z',
      lastCheckedAt: '5 minutes ago',
      bestStoreName: 'Best Buy',
    },
    {
      id: 'trk_seed_3',
      email: 'shopper@example.com',
      productId: 'prod_sony_ps5slim',
      product: MOCK_PRODUCTS.ps5.product,
      mode: 'any',
      initialPrice: 499.99,
      currentLowestPrice: 449.00,
      priceChange: -50.99,
      priceChangePercent: -10.2,
      sparklineData: [499.99, 499.99, 485.0, 479.0, 469.0, 455.0, 449.0],
      active: false,
      createdAt: '2026-10-05T08:00:00Z',
      lastCheckedAt: '2 hours ago',
      bestStoreName: 'Amazon',
    },
  ];

  try {
    localStorage.setItem(STORAGE_KEY_TRACKERS, JSON.stringify(initialTrackers));
  } catch (e) {
    // ignore
  }

  return initialTrackers;
}

function saveStoredTrackers(trackers: Tracker[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TRACKERS, JSON.stringify(trackers));
  } catch (e) {
    console.error('Failed saving trackers to storage', e);
  }
}

/**
 * 1. analyzeProductUrl
 * Identifies the exact product from a URL and scans multiple stores.
 */
export async function analyzeProductUrl(url: string): Promise<{ product: Product; offers: StoreOffer[] }> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}: Failed to analyze product URL`);
    return await res.json();
  }

  // Simulated AI parsing & store aggregation latency
  await new Promise((r) => setTimeout(r, 650));

  const lower = url.toLowerCase();
  if (lower.includes('iphone') || lower.includes('apple') || lower.includes('phone')) {
    return MOCK_PRODUCTS.iphone;
  }
  if (lower.includes('ps5') || lower.includes('playstation') || lower.includes('gaming') || lower.includes('console')) {
    return MOCK_PRODUCTS.ps5;
  }
  // Default to Sony WH-1000XM5
  return MOCK_PRODUCTS.sony;
}

/**
 * 2. getPriceHistory
 * Fetches time-series price data across selected historical ranges (7D, 30D, 90D, 1Y).
 */
export async function getPriceHistory(
  productId: string,
  range: PriceRange = '30D'
): Promise<PricePoint[]> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE_URL}/products/${productId}/history?range=${range}`);
    if (!res.ok) throw new Error(`Failed to fetch price history for ${productId}`);
    return await res.json();
  }

  await new Promise((r) => setTimeout(r, 300));

  // Determine baseline price based on product
  const basePrice = productId.includes('iphone')
    ? 1199
    : productId.includes('ps5')
    ? 499
    : 399;

  const pointsCount = range === '7D' ? 7 : range === '30D' ? 15 : range === '90D' ? 18 : 24;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const totalDays = range === '7D' ? 7 : range === '30D' ? 30 : range === '90D' ? 90 : 365;
  const stepMs = (totalDays * dayMs) / pointsCount;

  const points: PricePoint[] = [];

  for (let i = 0; i <= pointsCount; i++) {
    const time = now - (pointsCount - i) * stepMs;
    const dateObj = new Date(time);
    const dateLabel = range === '7D'
      ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
      : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Gradual decline with occasional spikes
    const factor = 1 - (i / pointsCount) * 0.18 + Math.sin(i * 1.5) * 0.03;
    const lowest = Math.round(basePrice * factor * 100) / 100;
    const amazon = Math.round((lowest + 12 + Math.sin(i) * 5) * 100) / 100;
    const walmart = Math.round((lowest + (i % 2 === 0 ? 0 : 8)) * 100) / 100;
    const bestbuy = Math.round((lowest + 20 - Math.cos(i) * 6) * 100) / 100;
    const ebay = Math.round((lowest - 5 + Math.random() * 10) * 100) / 100;
    const average = Math.round(((lowest + amazon + walmart + bestbuy) / 4) * 100) / 100;

    points.push({
      date: dateLabel,
      timestamp: time,
      lowest,
      average,
      amazon,
      walmart,
      bestbuy,
      ebay,
    });
  }

  return points;
}

/**
 * 3. createTracker
 * Creates an active price alert tracker for the specified email and product.
 */
export async function createTracker(payload: CreateTrackerPayload): Promise<{ success: boolean; trackerId: string }> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE_URL}/trackers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create tracker');
    return await res.json();
  }

  await new Promise((r) => setTimeout(r, 700));

  // Find product
  let product = MOCK_PRODUCTS.sony.product;
  let offers = MOCK_PRODUCTS.sony.offers;

  if (payload.productId === 'prod_apple_iphone15pro') {
    product = MOCK_PRODUCTS.iphone.product;
    offers = MOCK_PRODUCTS.iphone.offers;
  } else if (payload.productId === 'prod_sony_ps5slim') {
    product = MOCK_PRODUCTS.ps5.product;
    offers = MOCK_PRODUCTS.ps5.offers;
  }

  const bestOffer = offers.find((o) => o.isBestPrice) || offers[0];
  const newTrackerId = `trk_${Date.now()}`;

  const newTracker: Tracker = {
    id: newTrackerId,
    email: payload.email,
    productId: product.id,
    product,
    mode: payload.mode,
    targetPrice: payload.targetPrice,
    initialPrice: bestOffer.originalPrice,
    currentLowestPrice: bestOffer.price,
    priceChange: -(bestOffer.originalPrice - bestOffer.price),
    priceChangePercent: -Math.round(((bestOffer.originalPrice - bestOffer.price) / bestOffer.originalPrice) * 100),
    sparklineData: [
      bestOffer.originalPrice,
      bestOffer.originalPrice * 0.98,
      bestOffer.originalPrice * 0.94,
      bestOffer.price * 1.05,
      bestOffer.price,
    ],
    active: true,
    createdAt: new Date().toISOString(),
    lastCheckedAt: 'Just now',
    bestStoreName: bestOffer.storeName,
  };

  const stored = getStoredTrackers();
  // prepend new tracker
  const updated = [newTracker, ...stored.filter((t) => t.id !== newTrackerId)];
  saveStoredTrackers(updated);

  return { success: true, trackerId: newTrackerId };
}

/**
 * 4. getTrackers
 * Returns all products being tracked by this email address.
 */
export async function getTrackers(email: string): Promise<Tracker[]> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE_URL}/trackers?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('Failed to fetch trackers');
    return await res.json();
  }

  await new Promise((r) => setTimeout(r, 450));

  const all = getStoredTrackers();
  const normalized = email.trim().toLowerCase();
  
  // If user entered something, filter by email or return the sample set if it's the default demo email
  if (normalized === 'shopper@example.com' || normalized === '') {
    return all;
  }

  const userTrackers = all.filter((t) => t.email.toLowerCase() === normalized);
  if (userTrackers.length > 0) {
    return userTrackers;
  }

  // If user has no trackers under this specific custom email yet, return empty list
  return [];
}

/**
 * 5. deleteTracker
 * Permanently removes a tracker.
 */
export async function deleteTracker(trackerId: string): Promise<void> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE_URL}/trackers/${trackerId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete tracker');
    return;
  }

  await new Promise((r) => setTimeout(r, 400));
  const stored = getStoredTrackers();
  const updated = stored.filter((t) => t.id !== trackerId);
  saveStoredTrackers(updated);
}

/**
 * 6. toggleTracker
 * Pauses or resumes alerts for a tracker.
 */
export async function toggleTracker(trackerId: string, active: boolean): Promise<void> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE_URL}/trackers/${trackerId}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    if (!res.ok) throw new Error('Failed to update tracker status');
    return;
  }

  await new Promise((r) => setTimeout(r, 300));
  const stored = getStoredTrackers();
  const updated = stored.map((t) => (t.id === trackerId ? { ...t, active } : t));
  saveStoredTrackers(updated);
}

/**
 * 7. unsubscribe
 * Unsubscribes by email token from a single product or all alerts.
 */
export async function unsubscribe(token: string, scope: 'product' | 'all'): Promise<void> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE_URL}/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, scope }),
    });
    if (!res.ok) throw new Error('Failed to unsubscribe');
    return;
  }

  await new Promise((r) => setTimeout(r, 500));
  if (scope === 'all') {
    const stored = getStoredTrackers();
    const updated = stored.map((t) => ({ ...t, active: false }));
    saveStoredTrackers(updated);
  }
}
