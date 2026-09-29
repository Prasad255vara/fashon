export type UserRole = 'customer' | 'stylist' | 'manager' | 'superadmin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  twoFactorEnabled: boolean;
  twoFactorVerified?: boolean;
  memberTier: 'VIP Haute Tier' | 'Atelier Collective' | 'Standard Guest';
  createdAt: string;
}

export interface DressColor {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
  pantoneCode: string;
  imageUrl?: string;
}

export interface DressSizeOption {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  bustCm: string;
  waistCm: string;
  hipCm: string;
  lengthCm: string;
  stock: number;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number; // 1 to 5
  fitFeedback: 'Runs Small' | 'True to Size' | 'Runs Large';
  fabricFeel: 'Exquisite / Ultra-Luxe' | 'Substantial & Crisp' | 'Fluid & Weightless';
  title: string;
  comment: string;
  date: string;
  dressColorBought: string;
  sizeBought: string;
  verifiedBuyer: boolean;
  userPhotoUrl?: string;
  helpfulVotes: number;
}

export interface Dress {
  id: string;
  name: string;
  brand: string;
  frenchTitle: string;
  sku: string;
  collection: string;
  price: number; // In USD baseline
  originalPrice?: number;
  silhouette: 'Architectural Column' | 'Fluid Bias Cut' | 'Sculptural Peplum' | 'Corseted Ballgown' | 'Draped Halter';
  fabric: string;
  composition: string;
  drapeWeightGsm: number;
  closureType: string;
  careInstructions: string;
  runwaySeason: string;
  description: string;
  atelierNotes: string;
  colors: DressColor[];
  sizes: DressSizeOption[];
  featuredColorId: string;
  isNewArrival: boolean;
  isRunwayExclusive: boolean;
  imageUrl: string;
  galleryImages: string[];
  discountPercent?: number;
  tag?: string; // e.g. "HOT DROP", "BESTSELLER", "RUNWAY LOOK"
  rating: number;
  reviewCount: number;
  reviews: CustomerReview[];
}

export type GridViewMode = 'compact' | 'comfortable' | 'split';

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
}

export interface CartItem {
  id: string; // unique item uuid in cart
  dressId: string;
  dressName: string;
  frenchTitle: string;
  sku: string;
  color: DressColor;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  addressLine1: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}

export type PaymentGateway = 'apple_pay' | 'stripe_card' | 'klarna_slice' | 'concierge_wire';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  taxJurisdiction: string;
  taxRatePercent: number;
  shippingCost: number;
  total: number;
  currency: string;
  shippingAddress: ShippingAddress;
  paymentGateway: PaymentGateway;
  paymentStatus: 'Paid' | 'Processing' | 'Authorized';
  fulfillmentStatus: 'Order Placed' | 'Atelier Draping' | 'Dispatched' | 'Delivered';
  trackingNumber: string;
  endToEndCipherSeal: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'drop' | 'runway' | 'security' | 'order';
  read: boolean;
  actionLabel?: string;
  actionId?: string;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number; // against USD
  name: string;
}
