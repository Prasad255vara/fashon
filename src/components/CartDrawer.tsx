import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { calculateAutomatedTax, COUNTRY_TAX_RATES } from '../utils/tax';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Check,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalUSD,
    formatPrice,
    setIsCheckoutOpen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponDiscountUSD,
    t,
  } = useStore();

  const [selectedCountry, setSelectedCountry] = useState<string>('FR');
  const [couponInput, setCouponInput] = useState<string>('');
  const [couponFeedback, setCouponFeedback] = useState<string>('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1200;
  const freeShippingProgress = Math.min(100, (cartSubtotalUSD / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSubtotalUSD);

  const discountedSubtotal = Math.max(0, cartSubtotalUSD - couponDiscountUSD);
  const taxEstimate = calculateAutomatedTax(selectedCountry, discountedSubtotal);
  const estimatedTotalUSD = discountedSubtotal + taxEstimate.taxAmount + taxEstimate.dutiesAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res.message);
    if (res.success) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121317] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-display">
                Your Couture Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Snitch-Style Free Shipping Progress Bar */}
          <div className="px-5 py-3 bg-black/40 border-b border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              {remainingForFree > 0 ? (
                <span className="text-zinc-300">
                  Add <strong className="text-[#d4af37]">{formatPrice(remainingForFree)}</strong> for Free White-Glove Courier
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  Complimentary Global VIP Delivery Unlocked!
                </span>
              )}
              <span className="text-zinc-500">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-[#d4af37] h-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="p-5 overflow-y-auto flex-1 space-y-3">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400 font-mono">{t('empty_bag')}</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 rounded bg-zinc-800 text-white text-xs font-mono hover:bg-zinc-700"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 flex items-start gap-3.5"
                >
                  {/* Swatch & Size */}
                  <div
                    className="w-12 h-14 rounded-lg flex-shrink-0 border border-white/15 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: item.color.hex }}
                  >
                    <span
                      className="absolute inset-x-0 bottom-0 py-0.5 text-[8px] font-mono text-center uppercase"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: '#d4af37',
                      }}
                    >
                      {item.size}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase font-display truncate">
                      {item.dressName}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {item.color.name} &middot; Size {item.size}
                    </p>
                    <p className="text-xs font-bold font-mono text-white">
                      {formatPrice(item.price)}
                    </p>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center border border-white/15 rounded bg-black/40">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-white text-zinc-400"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-white text-zinc-400"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400 transition-colors ml-auto"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Snitch-Style Coupon Code Section */}
          {cart.length > 0 && (
            <div className="px-5 py-3 bg-zinc-950/80 border-t border-white/10 space-y-2">
              {appliedCoupon ? (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied ({appliedCoupon.discountPercent}% Off)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-zinc-400 hover:text-rose-400 text-[10px] uppercase font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. SNITCH10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded bg-zinc-900 border border-white/10 text-white text-xs font-mono outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponFeedback && (
                <p className="text-[10px] font-mono text-[#d4af37]">{couponFeedback}</p>
              )}
            </div>
          )}

          {/* Footer & Automated Tax & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-black/50 space-y-3.5 text-xs font-mono">
              {/* Dynamic Tax Location Selector */}
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <span className="text-zinc-400">Destination:</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-zinc-900 border border-white/15 text-white rounded px-2 py-1 outline-none text-xs"
                >
                  {Object.entries(COUNTRY_TAX_RATES).map(([code, rate]) => (
                    <option key={code} value={code}>
                      {code} ({rate.rate}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Subtotal & Discount Breakdown */}
              <div className="space-y-1 text-zinc-400">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-white">{formatPrice(cartSubtotalUSD)}</span>
                </div>
                {couponDiscountUSD > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Coupon Savings ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(couponDiscountUSD)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="truncate max-w-[200px]" title={taxEstimate.jurisdiction}>
                    {taxEstimate.jurisdiction}
                  </span>
                  <span className="text-[#d4af37]">+{formatPrice(taxEstimate.taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>White-Glove Express</span>
                  <span className="text-emerald-400 font-bold">
                    {remainingForFree === 0 ? 'FREE' : '$0 (Promo)'}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-sm font-bold text-white">
                <span>Final Investment</span>
                <span className="text-lg text-[#fcf6ba] font-mono">
                  {formatPrice(estimatedTotalUSD)}
                </span>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#c99f2e] text-black font-display font-bold uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 text-xs"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Shark Tank & Paris Haute Syndicate Authenticated</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
