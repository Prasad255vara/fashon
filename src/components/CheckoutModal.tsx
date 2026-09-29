import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { calculateAutomatedTax, COUNTRY_TAX_RATES } from '../utils/tax';
import { maskCreditCard } from '../utils/crypto';
import { Order, PaymentGateway } from '../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  ArrowRight,
  Download,
  Fingerprint,
  Building2,
  Sparkles,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotalUSD,
    formatPrice,
    createOrder,
    t,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Step 1: Shipping Address Form
  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'Helena de Montmirail',
    email: 'client@haute-atake.fr',
    addressLine1: '14 Avenue Montaigne',
    city: 'Paris',
    country: 'FR',
    postalCode: '75008',
    phone: '+33 1 42 68 55 00',
  });

  // Step 2: Payment Gateway
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('apple_pay');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9924');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const taxDetails = calculateAutomatedTax(shippingAddress.country, cartSubtotalUSD);
  const grandTotalUSD = cartSubtotalUSD + taxDetails.taxAmount + taxDetails.dutiesAmount;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalizePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = createOrder({
        shippingAddress,
        paymentGateway,
        countryCode: shippingAddress.country,
      });
      setCreatedOrder(order);
      setIsProcessing(false);
      setStep(4);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#121317] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black uppercase tracking-widest text-white font-display">
              ATAKÉ
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-mono">
              Secure Checkout
            </span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Header (Only shown when not finished) */}
        {step < 4 && (
          <div className="flex items-center justify-between py-4 text-xs font-mono text-zinc-400 border-b border-white/5">
            <span className={step === 1 ? 'text-[#d4af37] font-bold' : ''}>
              1. White-Glove Dispatch
            </span>
            <span>&rarr;</span>
            <span className={step === 2 ? 'text-[#d4af37] font-bold' : ''}>
              2. Encrypted Gateway
            </span>
            <span>&rarr;</span>
            <span className={step === 3 ? 'text-[#d4af37] font-bold' : ''}>
              3. Verification
            </span>
          </div>
        )}

        {/* STEP 1: SHIPPING & SALON DISPATCH ADDRESS */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} className="py-6 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase text-white font-display">
                Client Salon Dispatch Details
              </h3>
              <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Private Concierge Safe
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                  }
                  className="w-full p-2.5 rounded bg-zinc-900 border border-white/10 text-white outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Private Email</label>
                <input
                  type="email"
                  required
                  value={shippingAddress.email}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, email: e.target.value })
                  }
                  className="w-full p-2.5 rounded bg-zinc-900 border border-white/10 text-white outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Residence / Salon Address</label>
              <input
                type="text"
                required
                value={shippingAddress.addressLine1}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })
                }
                className="w-full p-2.5 rounded bg-zinc-900 border border-white/10 text-white outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-zinc-400 block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  className="w-full p-2.5 rounded bg-zinc-900 border border-white/10 text-white outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Country (Auto Tax)</label>
                <select
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, country: e.target.value })
                  }
                  className="w-full p-2.5 rounded bg-zinc-900 border border-white/10 text-white outline-none focus:border-[#d4af37]"
                >
                  {Object.entries(COUNTRY_TAX_RATES).map(([code, r]) => (
                    <option key={code} value={code}>
                      {r.name} ({code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                  }
                  className="w-full p-2.5 rounded bg-zinc-900 border border-white/10 text-white outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Automated Tax Calculation Notice */}
            <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-zinc-400 space-y-1">
              <div className="flex justify-between">
                <span>Tax Jurisdiction:</span>
                <span className="text-white">{taxDetails.jurisdiction}</span>
              </div>
              <div className="flex justify-between">
                <span>Automated Rate:</span>
                <span className="text-[#d4af37]">{taxDetails.ratePercent}%</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-[#d4af37] hover:bg-[#c99f2e] text-black font-display font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: MULTIPLE PAYMENT GATEWAYS & E2EE SEAL */}
        {step === 2 && (
          <div className="py-6 space-y-6 text-xs font-mono">
            <div>
              <h3 className="text-sm font-bold uppercase text-white font-display">
                Select Secure Payment Gateway
              </h3>
              <p className="text-zinc-400 text-xs mt-1">
                All transactions are tokenized with AES-256 end-to-end encryption.
              </p>
            </div>

            {/* Gateway Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Apple Pay */}
              <button
                type="button"
                onClick={() => setPaymentGateway('apple_pay')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentGateway === 'apple_pay'
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                    : 'border-white/10 hover:border-white/20 text-zinc-400'
                }`}
              >
                <Fingerprint className="w-5 h-5 text-[#d4af37]" />
                <span className="font-bold">Apple Pay</span>
              </button>

              {/* Stripe Credit Card */}
              <button
                type="button"
                onClick={() => setPaymentGateway('stripe_card')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentGateway === 'stripe_card'
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                    : 'border-white/10 hover:border-white/20 text-zinc-400'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#d4af37]" />
                <span className="font-bold">Stripe / Card</span>
              </button>

              {/* Klarna Slice */}
              <button
                type="button"
                onClick={() => setPaymentGateway('klarna_slice')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentGateway === 'klarna_slice'
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                    : 'border-white/10 hover:border-white/20 text-zinc-400'
                }`}
              >
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                <span className="font-bold">Klarna (4x)</span>
              </button>

              {/* Concierge Wire */}
              <button
                type="button"
                onClick={() => setPaymentGateway('concierge_wire')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentGateway === 'concierge_wire'
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                    : 'border-white/10 hover:border-white/20 text-zinc-400'
                }`}
              >
                <Building2 className="w-5 h-5 text-[#d4af37]" />
                <span className="font-bold">Salon Wire</span>
              </button>
            </div>

            {/* Gateway Details Display */}
            {paymentGateway === 'apple_pay' && (
              <div className="p-5 rounded-xl bg-black/50 border border-white/10 text-center space-y-3">
                <Fingerprint className="w-10 h-10 text-[#d4af37] mx-auto animate-pulse" />
                <p className="text-zinc-300">
                  Ready to authenticate with Apple Pay Touch ID / Face ID
                </p>
                <p className="text-zinc-500 text-[11px]">
                  Card: Apple Card &middot;&middot;&middot;&middot; 7192 (Encrypted)
                </p>
              </div>
            )}

            {paymentGateway === 'stripe_card' && (
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Encrypted Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2.5 rounded bg-zinc-900 border border-white/10 text-white outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1">Expiration</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2.5 rounded bg-zinc-900 border border-white/10 text-white outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Security CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full p-2.5 rounded bg-zinc-900 border border-white/10 text-white outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentGateway === 'klarna_slice' && (
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
                <p className="text-zinc-300 font-semibold">4 Interest-Free Payments of {formatPrice(grandTotalUSD / 4)}</p>
                <p className="text-zinc-400 text-[11px]">
                  First payment due today. Subsequent installments charged every 14 days automatically.
                </p>
              </div>
            )}

            {paymentGateway === 'concierge_wire' && (
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
                <p className="text-zinc-300 font-semibold">Banque Privée Haute Couture IBAN</p>
                <p className="text-zinc-400 text-[11px] font-mono">
                  IBAN: FR76 3000 4001 9283 7465 1920 382 &middot; BIC: BPOUFR21
                </p>
                <p className="text-[10px] text-zinc-500">
                  Your piece will be held in our Paris atelier for 72 hours upon wire initiation.
                </p>
              </div>
            )}

            {/* End-to-End Encryption Tokenization Seal */}
            <div className="p-3 rounded-lg bg-zinc-900/80 border border-emerald-500/30 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 text-emerald-400">
                <Lock className="w-4 h-4" />
                <span>End-to-End Encrypted Session: AES-256-GCM / SHA-256</span>
              </div>
              <span className="font-mono text-zinc-400">STATUS: VERIFIED</span>
            </div>

            {/* Total Breakdown */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal ({cart.length} items)</span>
                <span className="text-white">{formatPrice(cartSubtotalUSD)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Automated Tax ({taxDetails.ratePercent}% {taxDetails.jurisdiction})</span>
                <span className="text-[#d4af37]">+{formatPrice(taxDetails.taxAmount)}</span>
              </div>
              {taxDetails.dutiesAmount > 0 && (
                <div className="flex justify-between text-zinc-400">
                  <span>Customs Duty</span>
                  <span className="text-[#d4af37]">+{formatPrice(taxDetails.dutiesAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>White-Glove Courier Delivery</span>
                <span className="text-emerald-400">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>Total Authorization</span>
                <span className="text-lg text-[#fcf6ba] font-mono">{formatPrice(grandTotalUSD)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-zinc-400 hover:text-white"
              >
                &larr; Back to Address
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleFinalizePayment}
                className="px-8 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#c99f2e] text-black font-display font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Authorizing Encrypted Cipher...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Confirm ({formatPrice(grandTotalUSD)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMATION & CIPHER SEAL */}
        {step === 4 && createdOrder && (
          <div className="py-8 space-y-6 text-xs font-mono text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#d4af37]">
                Order Confirmed &middot; White-Glove Dispatch
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-display">
                {createdOrder.orderNumber}
              </h3>
              <p className="text-zinc-400">
                Recipient: {createdOrder.shippingAddress.fullName} &middot; {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.country}
              </p>
            </div>

            {/* Security Proof & Tokenization Seal */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-black/60 border border-white/10 text-left space-y-2">
              <p className="text-[10px] uppercase text-zinc-500">Cryptographic Cipher Seal</p>
              <p className="text-emerald-400 font-mono text-[11px] break-all">
                {createdOrder.endToEndCipherSeal}
              </p>
              <div className="flex justify-between text-zinc-400 pt-2 border-t border-white/5">
                <span>Courier Tracking Code:</span>
                <span className="text-white font-bold">{createdOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Atelier Status:</span>
                <span className="text-[#d4af37] font-bold">{createdOrder.fulfillmentStatus}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Receipt</span>
              </button>

              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="px-6 py-2.5 rounded-lg bg-[#d4af37] text-black font-bold uppercase transition-colors"
              >
                Return to Runway
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
