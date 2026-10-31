# PriceRadar — AI-Powered Price Tracking Frontend

A modern, high-performance, fully interactive frontend for **PriceRadar**, an AI-powered price comparison and drop alert platform.

## Features
- **Effortless Product Search**: Paste any URL from Amazon, Daraz, eBay, AliExpress, Walmart, Target, etc.
- **Multi-Step AI Inspection Animation**: Real-time simulated progress steps with skeleton layout transitions.
- **Multi-Store Comparison**: Side-by-side offers with store ratings, shipping costs, stock states, and best price badges.
- **Interactive Price History Chart**: Powered by Recharts with 7D/30D/90D/1Y range selectors, custom tooltips, and store line toggles.
- **Price Drop Alerts**: Sticky tracker sidebar and mobile bottom drawer with live regex email validation and target price thresholds.
- **GSAP Confetti & Checkmark**: Native celebratory animations and a full 600px email preview modal.
- **User Dashboard**: Tracked items with interactive SVG sparklines, status toggling, and deletion dialogs.
- **Dual-Theme Support**: Dark/Light mode toggle with persistence and system preference synchronization.
- **Accessibility**: Semantic HTML, visible focus rings, tabular numerals for pricing, and `prefers-reduced-motion` compliance.

---

## Connecting the Real Backend

All data interactions are isolated within `/src/services/api.ts` and configured via `/src/config.ts`. To connect your real production backend, set:

```typescript
// /src/config.ts
export const USE_MOCK = false;
export const API_BASE_URL = 'https://api.yourdomain.com/v1';
```

Replace or proxy the following async functions in `/src/services/api.ts`:

### 1. `analyzeProductUrl(url: string)`
- **HTTP Method**: `POST /api/analyze`
- **Request Body**: `{ "url": "https://amazon.com/dp/B09XS7JWHH" }`
- **Response Shape**:
```json
{
  "product": {
    "id": "prod_sony_wh1000xm5",
    "title": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Midnight Black",
    "brand": "Sony",
    "model": "WH-1000XM5/B",
    "category": "Electronics & Audio",
    "imageUrl": "https://cdn.yourdomain.com/images/sony_wh1000xm5.jpg",
    "rating": 4.8,
    "reviewCount": 14280,
    "matchConfidence": 98,
    "description": "Industry-leading noise cancellation...",
    "specs": {
      "Battery Life": "30 Hours",
      "Noise Cancellation": "Dual-chip Auto NC Optimizer"
    }
  },
  "offers": [
    {
      "id": "offer_walmart_sony",
      "storeName": "Walmart",
      "storeKey": "walmart",
      "storeDomain": "walmart.com",
      "price": 328.00,
      "originalPrice": 399.99,
      "discountPercent": 18,
      "shippingCost": 0,
      "shippingText": "Free 2-day delivery",
      "inStock": true,
      "stockStatus": "In Stock",
      "deliveryEstimate": "Arrives in 2 business days",
      "sellerRating": 4.7,
      "sellerReviews": 45200,
      "productUrl": "https://www.walmart.com",
      "isBestPrice": true,
      "verifiedSeller": true,
      "badge": "Lowest Price"
    }
  ]
}
```

---

### 2. `getPriceHistory(productId: string, range: '7D' | '30D' | '90D' | '1Y')`
- **HTTP Method**: `GET /api/products/:productId/history?range=30D`
- **Response Shape**:
```json
[
  {
    "date": "Oct 15",
    "timestamp": 1729000000000,
    "lowest": 328.00,
    "average": 348.50,
    "amazon": 339.99,
    "walmart": 328.00,
    "bestbuy": 349.99,
    "ebay": 335.00
  }
]
```

---

### 3. `createTracker(payload: CreateTrackerPayload)`
- **HTTP Method**: `POST /api/trackers`
- **Request Body**:
```json
{
  "email": "user@example.com",
  "productId": "prod_sony_wh1000xm5",
  "mode": "drop",
  "targetPrice": 330
}
```
- **Response Shape**:
```json
{
  "success": true,
  "trackerId": "trk_1793427000"
}
```

---

### 4. `getTrackers(email: string)`
- **HTTP Method**: `GET /api/trackers?email=user@example.com`
- **Response Shape**:
```json
[
  {
    "id": "trk_seed_1",
    "email": "user@example.com",
    "productId": "prod_sony_wh1000xm5",
    "product": { ... },
    "mode": "drop",
    "targetPrice": 330,
    "initialPrice": 399.99,
    "currentLowestPrice": 328.00,
    "priceChange": -71.99,
    "priceChangePercent": -18,
    "sparklineData": [399.99, 389.0, 360.0, 328.0],
    "active": true,
    "createdAt": "2026-10-18T10:30:00Z",
    "lastCheckedAt": "12 minutes ago",
    "bestStoreName": "Walmart"
  }
]
```

---

### 5. `deleteTracker(trackerId: string)`
- **HTTP Method**: `DELETE /api/trackers/:trackerId`
- **Response Shape**: `204 No Content` or `{ "success": true }`

---

### 6. `toggleTracker(trackerId: string, active: boolean)`
- **HTTP Method**: `PATCH /api/trackers/:trackerId/toggle`
- **Request Body**: `{ "active": false }`
- **Response Shape**: `{ "success": true, "active": false }`

---

### 7. `unsubscribe(token: string, scope: 'product' | 'all')`
- **HTTP Method**: `POST /api/unsubscribe`
- **Request Body**: `{ "token": "token_abc123", "scope": "all" }`
- **Response Shape**: `{ "success": true }`
