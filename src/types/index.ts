export interface Product {
  id: string;
  title: string;
  brand: string;
  model: string;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  matchConfidence: number; // e.g. 98 for 98%
  description?: string;
  specs?: { [key: string]: string };
}

export interface StoreOffer {
  id: string;
  storeName: string;
  storeKey: string;
  storeDomain: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  shippingCost: number; // 0 for free
  shippingText: string;
  inStock: boolean;
  stockStatus: string;
  deliveryEstimate: string;
  sellerRating: number;
  sellerReviews: number;
  productUrl: string;
  isBestPrice: boolean;
  verifiedSeller: boolean;
  badge?: string;
}

export interface PricePoint {
  date: string;
  timestamp: number;
  lowest: number;
  average: number;
  amazon?: number;
  walmart?: number;
  bestbuy?: number;
  ebay?: number;
  aliexpress?: number;
  daraz?: number;
  target?: number;
  newegg?: number;
  [key: string]: number | string | undefined;
}

export type PriceRange = '7D' | '30D' | '90D' | '1Y';

export interface Tracker {
  id: string;
  email: string;
  productId: string;
  product: Product;
  mode: 'any' | 'drop' | 'target';
  targetPrice?: number;
  initialPrice: number;
  currentLowestPrice: number;
  priceChange: number; // negative if price decreased
  priceChangePercent: number;
  sparklineData: number[];
  active: boolean;
  createdAt: string;
  lastCheckedAt: string;
  bestStoreName: string;
}

export interface CreateTrackerPayload {
  email: string;
  productId: string;
  mode: 'any' | 'drop' | 'target';
  targetPrice?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarInitials: string;
  createdAt: string;
}

export interface NotificationSettings {
  email: string;
  priceDrops: boolean;
  targetReached: boolean;
  weeklyDigest: boolean;
  stockAlerts: boolean;
  marketing: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export type TrackingFailureStatus = 'open' | 'retrying' | 'resolved';

export interface TrackingFailure {
  id: string;
  productTitle: string;
  productUrl: string;
  storeName: string;
  errorCode: string;
  errorMessage: string;
  attempts: number;
  lastAttemptAt: string;
  status: TrackingFailureStatus;
  severity: 'low' | 'medium' | 'high';
}
