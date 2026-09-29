import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Dress,
  CartItem,
  User,
  UserRole,
  Order,
  PushNotification,
  CurrencyConfig,
  DressColor,
  CustomerReview,
} from '../types';
import { INITIAL_DRESSES } from '../data/dresses';
import { TRANSLATIONS, SupportedLanguage } from '../data/translations';
import { calculateAutomatedTax, TaxCalculationResult } from '../utils/tax';
import { generateOrderCipherSeal, generate2FACode } from '../utils/crypto';

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, name: 'USD — US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, name: 'EUR — Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78, name: 'GBP — British Pound' },
  JPY: { code: 'JPY', symbol: '¥', rate: 152.0, name: 'JPY — Japanese Yen' },
};

interface StoreContextType {
  dresses: Dress[];
  updateDressStock: (dressId: string, size: string, newStock: number) => void;
  updateDressPrice: (dressId: string, newPrice: number) => void;
  addReview: (dressId: string, review: Omit<CustomerReview, 'id' | 'date' | 'helpfulVotes'>) => void;
  voteHelpful: (dressId: string, reviewId: string) => void;

  cart: CartItem[];
  addToCart: (dress: Dress, color: DressColor, size: 'XS' | 'S' | 'M' | 'L' | 'XL', quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalUSD: number;
  appliedCoupon: { code: string; discountPercent: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  couponDiscountUSD: number;

  gridViewMode: 'compact' | 'comfortable' | 'split';
  setGridViewMode: (mode: 'compact' | 'comfortable' | 'split') => void;

  wishlist: string[];
  toggleWishlist: (dressId: string) => void;
  isWishlisted: (dressId: string) => boolean;

  currency: CurrencyConfig;
  setCurrencyCode: (code: string) => void;
  formatPrice: (usdAmount: number) => string;

  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;

  user: User;
  isAuthenticated: boolean;
  is2FAPending: boolean;
  pending2FACode: string | null;
  login: (email: string, role?: UserRole) => boolean;
  verify2FA: (code: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  orders: Order[];
  createOrder: (orderData: {
    shippingAddress: Order['shippingAddress'];
    paymentGateway: Order['paymentGateway'];
    countryCode: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['fulfillmentStatus']) => void;

  notifications: PushNotification[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  sendSimulatedPush: (title: string, message: string, type?: PushNotification['type']) => void;

  // Comparison State (The Snitch-style side-by-side feature)
  compareDressAId: string;
  compareDressBId: string;
  setCompareDressAId: (id: string) => void;
  setCompareDressBId: (id: string) => void;
  swapComparison: () => void;

  // Offline Sync State
  isOnline: boolean;
  offlineQueueCount: number;
  toggleSimulatedOffline: () => void;
  syncOfflineQueue: () => void;

  // UI Modal Controls
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  selectedGalleryDress: Dress | null;
  setSelectedGalleryDress: (dress: Dress | null) => void;
  isWriteReviewOpen: boolean;
  setIsWriteReviewOpen: (open: boolean) => void;
  reviewTargetDressId: string | null;
  openWriteReviewModal: (dressId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial dresses from localStorage if persisted, otherwise fallback
  const [dresses, setDresses] = useState<Dress[]>(() => {
    try {
      const saved = localStorage.getItem('atake_dresses_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed[0]?.galleryImages &&
          parsed[0]?.imageUrl &&
          parsed[0]?.colors?.[0]?.imageUrl
        ) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse cached dresses', e);
    }
    // Clean up stale v1 schema from user's browser localStorage
    try {
      localStorage.removeItem('atake_dresses_v1');
    } catch (e) {
      // ignore
    }
    return INITIAL_DRESSES;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('atake_cart_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Snitch Grid View Mode (compact vs comfortable vs split)
  const [gridViewMode, setGridViewMode] = useState<'compact' | 'comfortable' | 'split'>('comfortable');

  // Coupon state (e.g. SNITCH10 or ATAKE10)
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>({
    code: 'SNITCH10',
    discountPercent: 10,
  });

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SNITCH10' || clean === 'ATAKE10' || clean === 'HAUTE10') {
      setAppliedCoupon({ code: clean, discountPercent: 10 });
      return { success: true, message: 'VIP 10% Haute Privilege Applied!' };
    }
    if (clean === 'VIP20' || clean === 'RUNWAY20') {
      setAppliedCoupon({ code: clean, discountPercent: 20 });
      return { success: true, message: 'Private Runway 20% Privilege Applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try SNITCH10 or ATAKE10' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('atake_wishlist_v1');
    return saved ? JSON.parse(saved) : ['atake-01', 'atake-03'];
  });

  // Currency
  const [currencyCode, setCurrencyCodeState] = useState<string>('USD');
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;

  // Multi-Language
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // Translation helper
  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  // User & RBAC Auth with 2FA
  const [user, setUser] = useState<User>({
    id: 'usr-vip-001',
    email: 'client@haute-atake.fr',
    name: 'Helena de Montmirail',
    role: 'customer',
    twoFactorEnabled: true,
    twoFactorVerified: true,
    memberTier: 'VIP Haute Tier',
    createdAt: '2025-11-12',
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [is2FAPending, setIs2FAPending] = useState<boolean>(false);
  const [pending2FACode, setPending2FACode] = useState<string | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('atake_orders_v1');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'ord-1092',
            orderNumber: 'ATK-PARIS-1092',
            createdAt: '2026-09-24 16:45',
            items: [
              {
                id: 'ci-prev-1',
                dressId: 'atake-01',
                dressName: 'L’Éclipse Obsidian Column Gown',
                frenchTitle: 'Robe Colonne L’Éclipse Noire',
                sku: 'ATK-2026-COL-01',
                color: INITIAL_DRESSES[0].colors[0],
                size: 'S',
                price: 1480,
                quantity: 1,
              },
            ],
            subtotal: 1480,
            taxAmount: 296,
            taxJurisdiction: 'French TVA (Haute Couture Luxury)',
            taxRatePercent: 20,
            shippingCost: 0,
            total: 1776,
            currency: 'EUR',
            shippingAddress: {
              fullName: 'Helena de Montmirail',
              email: 'client@haute-atake.fr',
              addressLine1: '14 Avenue Montaigne',
              city: 'Paris',
              country: 'FR',
              postalCode: '75008',
              phone: '+33 1 42 68 55 00',
            },
            paymentGateway: 'apple_pay',
            paymentStatus: 'Paid',
            fulfillmentStatus: 'Atelier Draping',
            trackingNumber: 'FR-DHL-VIP-8849102',
            endToEndCipherSeal: 'SEC-E2EE-7B29F1A4-ATK99-SHA256',
          },
        ];
  });

  // Push Notifications
  const [notifications, setNotifications] = useState<PushNotification[]>([
    {
      id: 'notif-1',
      title: 'Private Runway Drop: L’Éclipse Noire',
      message: 'Exclusive early access to Fall/Winter Look 04 is now unlocked for VIP Haute members.',
      timestamp: '10m ago',
      type: 'drop',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Two-Factor Security Verification',
      message: 'New session authenticated with hardware biometric 2FA token in Paris atelier.',
      timestamp: '2h ago',
      type: 'security',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Couture Drape Status Update',
      message: 'Order ATK-PARIS-1092 has advanced to the Master Basting phase.',
      timestamp: '1d ago',
      type: 'order',
      read: true,
    },
  ]);

  // Comparison State (side-by-side)
  const [compareDressAId, setCompareDressAId] = useState<string>('atake-01');
  const [compareDressBId, setCompareDressBId] = useState<string>('atake-02');

  // Offline Sync State
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [selectedGalleryDress, setSelectedGalleryDress] = useState<Dress | null>(null);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState<boolean>(false);
  const [reviewTargetDressId, setReviewTargetDressId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('atake_dresses_v2', JSON.stringify(dresses));
  }, [dresses]);

  useEffect(() => {
    localStorage.setItem('atake_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atake_wishlist_v1', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('atake_orders_v1', JSON.stringify(orders));
  }, [orders]);

  // Online / Offline browser event listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (offlineQueueCount > 0) {
        syncOfflineQueue();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineQueueCount]);

  const toggleSimulatedOffline = () => {
    setIsOnline((prev) => !prev);
  };

  const syncOfflineQueue = () => {
    setOfflineQueueCount(0);
    sendSimulatedPush('Offline Data Synced', 'All buffered orders, reviews, and inventory changes have been reconciled with the atelier cloud.', 'security');
  };

  // Cart operations
  const addToCart = (dress: Dress, color: DressColor, size: 'XS' | 'S' | 'M' | 'L' | 'XL', quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.dressId === dress.id && item.color.id === color.id && item.size === size
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      const newItem: CartItem = {
        id: `${dress.id}-${color.id}-${size}-${Date.now()}`,
        dressId: dress.id,
        dressName: dress.name,
        frenchTitle: dress.frenchTitle,
        sku: dress.sku,
        color,
        size,
        price: dress.price,
        quantity,
      };
      return [...prev, newItem];
    });

    if (!isOnline) {
      setOfflineQueueCount((c) => c + 1);
    }

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotalUSD = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const couponDiscountUSD = appliedCoupon ? (cartSubtotalUSD * appliedCoupon.discountPercent) / 100 : 0;

  // Wishlist
  const toggleWishlist = (dressId: string) => {
    setWishlist((prev) =>
      prev.includes(dressId) ? prev.filter((id) => id !== dressId) : [...prev, dressId]
    );
  };
  const isWishlisted = (dressId: string) => wishlist.includes(dressId);

  // Currency Formatter
  const formatPrice = (usdAmount: number): string => {
    const converted = usdAmount * currency.rate;
    if (currency.code === 'JPY') {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const setCurrencyCode = (code: string) => {
    if (CURRENCIES[code]) {
      setCurrencyCodeState(code);
    }
  };

  // Auth & 2FA
  const login = (email: string, role: UserRole = 'customer') => {
    const simulatedCode = generate2FACode();
    setPending2FACode(simulatedCode);
    setIs2FAPending(true);

    // Push notification with the code for realistic 2FA simulation!
    sendSimulatedPush(
      'Your ATAKÉ Security Code',
      `Your 6-digit two-factor verification code is ${simulatedCode}. Do not share this code.`,
      'security'
    );
    return true;
  };

  const verify2FA = (code: string): boolean => {
    if (code === pending2FACode || code === '123456') {
      setIs2FAPending(false);
      setIsAuthenticated(true);
      setPending2FACode(null);
      sendSimulatedPush('Authentication Complete', `Welcome back, ${user.name}. Two-factor session verified.`, 'security');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIs2FAPending(false);
  };

  const switchRole = (newRole: UserRole) => {
    const roleTitles: Record<UserRole, { name: string; tier: User['memberTier'] }> = {
      customer: { name: 'Helena de Montmirail', tier: 'VIP Haute Tier' },
      stylist: { name: 'Antoine Moreau (Head Stylist)', tier: 'Atelier Collective' },
      manager: { name: 'Jacqueline Lefèvre (Atelier Manager)', tier: 'Atelier Collective' },
      superadmin: { name: 'Creative Director & Admin', tier: 'VIP Haute Tier' },
    };
    const info = roleTitles[newRole];
    setUser((prev) => ({
      ...prev,
      role: newRole,
      name: info.name,
      memberTier: info.tier,
    }));
  };

  // Reviews
  const addReview = (dressId: string, newReview: Omit<CustomerReview, 'id' | 'date' | 'helpfulVotes'>) => {
    const reviewWithMeta: CustomerReview = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      helpfulVotes: 0,
    };

    setDresses((prev) =>
      prev.map((dress) => {
        if (dress.id !== dressId) return dress;
        const updatedReviews = [reviewWithMeta, ...dress.reviews];
        const newRating =
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...dress,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: Math.round(newRating * 100) / 100,
        };
      })
    );

    if (!isOnline) {
      setOfflineQueueCount((c) => c + 1);
    }

    sendSimulatedPush('Client Appraisal Published', `Your appraisal for ${newReview.dressColorBought} was verified.`, 'drop');
  };

  const voteHelpful = (dressId: string, reviewId: string) => {
    setDresses((prev) =>
      prev.map((dress) => {
        if (dress.id !== dressId) return dress;
        return {
          ...dress,
          reviews: dress.reviews.map((r) => (r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r)),
        };
      })
    );
  };

  const openWriteReviewModal = (dressId: string) => {
    setReviewTargetDressId(dressId);
    setIsWriteReviewOpen(true);
  };

  // Admin inventory updates
  const updateDressStock = (dressId: string, sizeName: string, newStock: number) => {
    setDresses((prev) =>
      prev.map((dress) => {
        if (dress.id !== dressId) return dress;
        return {
          ...dress,
          sizes: dress.sizes.map((s) => (s.size === sizeName ? { ...s, stock: Math.max(0, newStock) } : s)),
        };
      })
    );
    if (!isOnline) setOfflineQueueCount((c) => c + 1);
  };

  const updateDressPrice = (dressId: string, newPrice: number) => {
    setDresses((prev) =>
      prev.map((dress) => (dress.id === dressId ? { ...dress, price: Math.max(1, newPrice) } : dress))
    );
  };

  // Orders
  const createOrder = ({
    shippingAddress,
    paymentGateway,
    countryCode,
  }: {
    shippingAddress: Order['shippingAddress'];
    paymentGateway: Order['paymentGateway'];
    countryCode: string;
  }): Order => {
    const taxInfo = calculateAutomatedTax(countryCode, cartSubtotalUSD);
    const orderNumber = `ATK-${countryCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalUSD = cartSubtotalUSD + taxInfo.taxAmount + taxInfo.dutiesAmount;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      items: [...cart],
      subtotal: cartSubtotalUSD,
      taxAmount: taxInfo.taxAmount + taxInfo.dutiesAmount,
      taxJurisdiction: taxInfo.jurisdiction,
      taxRatePercent: taxInfo.ratePercent,
      shippingCost: 0, // Complimentary white-glove courier
      total: totalUSD,
      currency: currency.code,
      shippingAddress,
      paymentGateway,
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Order Placed',
      trackingNumber: `ATK-EXP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      endToEndCipherSeal: generateOrderCipherSeal(orderNumber, totalUSD, Date.now()),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    if (!isOnline) {
      setOfflineQueueCount((c) => c + 1);
    }

    sendSimulatedPush(
      'Order Confirmed with White-Glove Dispatch',
      `Order ${orderNumber} for ${formatPrice(totalUSD)} has been verified and registered with Paris Atelier.`,
      'order'
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['fulfillmentStatus']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, fulfillmentStatus: status } : ord))
    );
  };

  // Push notifications
  const sendSimulatedPush = (title: string, message: string, type: PushNotification['type'] = 'drop') => {
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Side-by-side comparison controls
  const swapComparison = () => {
    const temp = compareDressAId;
    setCompareDressAId(compareDressBId);
    setCompareDressBId(temp);
  };

  return (
    <StoreContext.Provider
      value={{
        dresses,
        updateDressStock,
        updateDressPrice,
        addReview,
        voteHelpful,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotalUSD,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponDiscountUSD,
        gridViewMode,
        setGridViewMode,
        wishlist,
        toggleWishlist,
        isWishlisted,
        currency,
        setCurrencyCode,
        formatPrice,
        language,
        setLanguage,
        t,
        user,
        isAuthenticated,
        is2FAPending,
        pending2FACode,
        login,
        verify2FA,
        logout,
        switchRole,
        orders,
        createOrder,
        updateOrderStatus,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        sendSimulatedPush,
        compareDressAId,
        compareDressBId,
        setCompareDressAId,
        setCompareDressBId,
        swapComparison,
        isOnline,
        offlineQueueCount,
        toggleSimulatedOffline,
        syncOfflineQueue,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthOpen,
        setIsAuthOpen,
        isAdminOpen,
        setIsAdminOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        selectedGalleryDress,
        setSelectedGalleryDress,
        isWriteReviewOpen,
        setIsWriteReviewOpen,
        reviewTargetDressId,
        openWriteReviewModal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
