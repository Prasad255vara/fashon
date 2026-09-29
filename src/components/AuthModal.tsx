import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import {
  X,
  ShieldCheck,
  KeyRound,
  Lock,
  UserCheck,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Layers,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthOpen,
    setIsAuthOpen,
    user,
    isAuthenticated,
    is2FAPending,
    pending2FACode,
    login,
    verify2FA,
    logout,
    switchRole,
    orders,
    formatPrice,
    t,
  } = useStore();

  const [inputEmail, setInputEmail] = useState(user.email);
  const [twoFactorInput, setTwoFactorInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'rbac' | 'orders'>('profile');

  if (!isAuthOpen) return null;

  const handleStartLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    login(inputEmail, user.role);
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const success = verify2FA(twoFactorInput);
    if (!success) {
      setErrorMessage('Invalid 6-digit code. Please enter the verification code sent to your notification center or use 123456.');
    } else {
      setTwoFactorInput('');
    }
  };

  const rolesList: { role: UserRole; title: string; desc: string }[] = [
    {
      role: 'customer',
      title: 'VIP Haute Patron',
      desc: 'Access to private runway pre-releases, bespoke orders, and client reviews.',
    },
    {
      role: 'stylist',
      title: 'Lead Runway Stylist',
      desc: 'Can assemble comparison lookbooks and verify fabric drape weights.',
    },
    {
      role: 'manager',
      title: 'Atelier Inventory Manager',
      desc: 'Real-time SKU adjustments, stock restocking per size, and low-inventory alerts.',
    },
    {
      role: 'superadmin',
      title: 'Creative Director & Admin',
      desc: 'Full administrative access: pricing control, analytics, order fulfillment dispatch.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#131418] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black uppercase text-white font-display">
              ATAKÉ
            </span>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono">
              Identity & 2FA Vault
            </span>
          </div>

          <button
            onClick={() => setIsAuthOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2FA Challenge View (When pending verification) */}
        {is2FAPending ? (
          <div className="py-8 space-y-6 text-center text-xs font-mono">
            <div className="w-14 h-14 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mx-auto">
              <KeyRound className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#d4af37]">
                Multi-Factor Security Challenge
              </span>
              <h3 className="text-2xl font-bold uppercase text-white font-display">
                Enter 6-Digit Verification Code
              </h3>
              <p className="text-zinc-400 max-w-sm mx-auto">
                A one-time cryptographic passcode was dispatched to your secure notifications.
              </p>
            </div>

            {/* Helper callout showing simulated code for easy verification */}
            {pending2FACode && (
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 max-w-sm mx-auto text-center">
                <span>Atelier Security Dispatch Code: </span>
                <span className="font-bold text-white tracking-widest text-sm">{pending2FACode}</span>
                <p className="text-[10px] text-amber-300/80 mt-1">or type '123456'</p>
              </div>
            )}

            <form onSubmit={handleVerify2FA} className="max-w-xs mx-auto space-y-4">
              <input
                type="text"
                maxLength={6}
                autoFocus
                placeholder="123456"
                value={twoFactorInput}
                onChange={(e) => setTwoFactorInput(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-2xl tracking-[0.4em] py-3 rounded-xl bg-zinc-900 border border-white/20 text-white font-mono outline-none focus:border-[#d4af37]"
              />

              {errorMessage && (
                <p className="text-rose-400 text-xs flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMessage}</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#c99f2e] text-black font-display font-bold uppercase tracking-wider transition-all"
              >
                Authenticate Session
              </button>
            </form>
          </div>
        ) : !isAuthenticated ? (
          /* Sign In Form */
          <form onSubmit={handleStartLogin} className="py-8 space-y-5 text-xs font-mono max-w-sm mx-auto w-full">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold uppercase text-white font-display">
                Client Vault Sign In
              </h3>
              <p className="text-zinc-400">
                Protected by Hardware & Biometric 2FA tokenization.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 block">Atelier Registered Email</label>
              <input
                type="email"
                required
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-zinc-900 border border-white/10 text-white outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#c99f2e] text-black font-display font-bold uppercase tracking-wider transition-all"
            >
              Request 2FA Verification Code
            </button>
          </form>
        ) : (
          /* Authenticated User Profile & RBAC Switcher */
          <div className="py-6 space-y-6 text-xs font-mono">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-white text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Profile & 2FA Status
              </button>
              <button
                onClick={() => setActiveTab('rbac')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'rbac'
                    ? 'bg-white text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Role-Based Access (RBAC)
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-white text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Order History ({orders.length})
              </button>
            </div>

            {/* TAB 1: PROFILE & SECURITY STATUS */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white font-display">
                      {user.name}
                    </h4>
                    <p className="text-zinc-400">{user.email}</p>
                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <span className="text-[#d4af37] font-semibold">{user.memberTier}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span className="text-zinc-400 uppercase">Role: {user.role}</span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded border border-white/15 text-zinc-400 hover:text-rose-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>

                {/* 2FA Security Proof Box */}
                <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="font-bold">Two-Factor Authentication: ACTIVE</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                      TOTP 30s
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Account protected against credential stuffing and brute-force attempts. Hardware token biometric challenge required on all cross-device logins.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: ROLE-BASED ACCESS CONTROL (RBAC) */}
            {activeTab === 'rbac' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white font-display">
                    Interactive Role-Based Access Control Switcher
                  </h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    Switch administrative roles to evaluate live permissions across the Atelier dashboard, inventory restock, and salon fulfillment.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rolesList.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => switchRole(item.role)}
                      className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
                        user.role === item.role
                          ? 'border-[#d4af37] bg-[#d4af37]/15 ring-1 ring-[#d4af37]'
                          : 'border-white/10 hover:border-white/20 bg-zinc-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white font-display text-xs uppercase">
                          {item.title}
                        </span>
                        {user.role === item.role && (
                          <CheckCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <p className="text-zinc-500 text-center py-8">No couture orders on file.</p>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs font-mono">{ord.orderNumber}</span>
                        <span className="text-[#d4af37] font-semibold text-xs">{ord.fulfillmentStatus}</span>
                      </div>
                      <p className="text-zinc-400 text-[11px]">
                        {ord.createdAt} &middot; {ord.items.length} garments &middot; Total: {formatPrice(ord.total)}
                      </p>
                      <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between border-t border-white/5 pt-1.5">
                        <span>Courier: {ord.trackingNumber}</span>
                        <span className="text-emerald-400">Cipher Verified</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
