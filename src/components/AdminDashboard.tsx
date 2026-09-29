import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import {
  X,
  TrendingUp,
  Package,
  Layers,
  DollarSign,
  AlertTriangle,
  Plus,
  Minus,
  Edit2,
  Check,
  Truck,
  ShieldCheck,
  Users,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    user,
    dresses,
    updateDressStock,
    updateDressPrice,
    orders,
    updateOrderStatus,
    formatPrice,
    setIsAuthOpen,
    isOnline,
    offlineQueueCount,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders'>('analytics');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  if (!isAdminOpen) return null;

  // RBAC Permission Check: If customer role tries to open, show polite upgrade prompt
  const hasAdminPrivileges = user.role === 'manager' || user.role === 'superadmin' || user.role === 'stylist';

  // Compute Analytics
  const totalRevenueUSD = orders.reduce((sum, ord) => sum + ord.total, 38400); // base simulated atelier volume
  const totalOrdersCount = orders.length + 24;
  const totalGarmentsInStock = (dresses || []).reduce(
    (sum, d) => sum + (d?.sizes || []).reduce((sSum, s) => sSum + s.stock, 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#101115] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black uppercase text-white font-display">
              ATAKÉ
            </span>
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono">
              Atelier Intelligence & Inventory Console
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-400">
              Operator: <span className="text-white font-semibold">{user.name}</span> ({user.role})
            </span>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!hasAdminPrivileges ? (
          <div className="py-16 text-center space-y-4 max-w-md mx-auto font-mono text-xs">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white font-display uppercase">
              Role-Based Access Control Notice
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Your active session is currently set to <strong>Client (VIP Haute)</strong>. To inspect administrative inventory controls and real-time revenue analytics, switch your role via the Identity & 2FA Vault.
            </p>
            <button
              onClick={() => {
                setIsAdminOpen(false);
                setIsAuthOpen(true);
              }}
              className="px-6 py-2.5 rounded-lg bg-[#d4af37] text-black font-bold uppercase transition-colors"
            >
              Switch Role in RBAC Vault
            </button>
          </div>
        ) : (
          <div className="py-6 space-y-6 text-xs font-mono">
            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-white text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Real-Time Analytics
                </button>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'inventory'
                      ? 'bg-white text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Live Inventory & SKUs ({totalGarmentsInStock} in Atelier)
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-white text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Salon Fulfillment & Tracking ({orders.length})
                </button>
              </div>

              {!isOnline && (
                <span className="text-amber-400 text-[11px] font-mono animate-pulse">
                  Offline Sync Buffering ({offlineQueueCount} queued)
                </span>
              )}
            </div>

            {/* TAB 1: ANALYTICS METRICS & REVENUE CHARTS */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-1">
                    <p className="text-[10px] uppercase text-zinc-400">Total Couture Revenue</p>
                    <p className="text-2xl font-black text-white font-display">
                      {formatPrice(totalRevenueUSD)}
                    </p>
                    <p className="text-emerald-400 text-[10px]">+18.4% vs last fashion cycle</p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-1">
                    <p className="text-[10px] uppercase text-zinc-400">Average Order Value (AOV)</p>
                    <p className="text-2xl font-black text-[#d4af37] font-display">
                      {formatPrice(1520)}
                    </p>
                    <p className="text-zinc-400 text-[10px]">High-jewelry & dress bundles</p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-1">
                    <p className="text-[10px] uppercase text-zinc-400">Runway Conversion Rate</p>
                    <p className="text-2xl font-black text-white font-display">3.8%</p>
                    <p className="text-emerald-400 text-[10px]">Compare-to-cart rate 44%</p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-1">
                    <p className="text-[10px] uppercase text-zinc-400">Active Salon Orders</p>
                    <p className="text-2xl font-black text-white font-display">
                      {totalOrdersCount}
                    </p>
                    <p className="text-zinc-400 text-[10px]">100% white-glove fulfilled</p>
                  </div>
                </div>

                {/* SVG Revenue Graph */}
                <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-display uppercase">
                      2026 Couture Sales Velocity (Monthly €K)
                    </h4>
                    <span className="text-[11px] text-[#d4af37]">Paris Fashion Week Spikes</span>
                  </div>

                  <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2">
                    {[
                      { m: 'May', h: 45, rev: '€45K' },
                      { m: 'Jun', h: 60, rev: '€60K' },
                      { m: 'Jul', h: 52, rev: '€52K' },
                      { m: 'Aug', h: 78, rev: '€78K' },
                      { m: 'Sep', h: 95, rev: '€95K' },
                      { m: 'Oct', h: 100, rev: '€112K' },
                    ].map((bar, i) => (
                      <div key={bar.m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {bar.rev}
                        </span>
                        <div
                          className={`w-full rounded-t transition-all ${
                            i === 5 ? 'bg-[#d4af37]' : 'bg-zinc-800 hover:bg-zinc-700'
                          }`}
                          style={{ height: `${bar.h}%` }}
                        />
                        <span className="text-[10px] text-zinc-400">{bar.m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sales Breakdown by Collection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/10 space-y-2">
                    <h5 className="font-bold text-white uppercase text-xs">Top Silhouette Demand</h5>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-zinc-400">
                        <span>Architectural Column</span>
                        <span className="text-white font-bold">42%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#d4af37] h-full" style={{ width: '42%' }} />
                      </div>
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-zinc-400">
                        <span>Fluid Bias Silk</span>
                        <span className="text-white font-bold">36%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: '36%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/10 space-y-2">
                    <h5 className="font-bold text-white uppercase text-xs">Global Destination Demand</h5>
                    <div className="space-y-1 text-zinc-300 text-[11px]">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span>France & Monaco (Paris Salon)</span>
                        <span className="text-[#d4af37]">38%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span>United States (New York / Beverly Hills)</span>
                        <span className="text-[#d4af37]">29%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span>United Kingdom & UAE</span>
                        <span className="text-[#d4af37]">21%</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Japan & Italy</span>
                        <span className="text-[#d4af37]">12%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LIVE INVENTORY MANAGEMENT PER SKU & SIZE */}
            {activeTab === 'inventory' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <p>Real-time size stock steppers. Changes persist offline and reconcile automatically.</p>
                  <span className="text-[#d4af37]">Direct Atelier Sync</span>
                </div>

                <div className="space-y-4">
                  {dresses.map((dress) => {
                    const isEditingPrice = editingPriceId === dress.id;
                    const totalDressStock = dress.sizes.reduce((sum, s) => sum + s.stock, 0);

                    return (
                      <div
                        key={dress.id}
                        className="p-5 rounded-xl bg-zinc-900/50 border border-white/10 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold uppercase text-white font-display">
                                {dress.name}
                              </h4>
                              {totalDressStock <= 5 && (
                                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Low Atelier Reserve
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400">
                              SKU: {dress.sku} &middot; {dress.silhouette} &middot; {dress.drapeWeightGsm} GSM
                            </p>
                          </div>

                          {/* Price Editor */}
                          <div className="flex items-center gap-2">
                            {isEditingPrice ? (
                              <div className="flex items-center gap-1">
                                <span className="text-zinc-400">$</span>
                                <input
                                  type="number"
                                  value={tempPrice}
                                  onChange={(e) => setTempPrice(Number(e.target.value))}
                                  className="w-20 p-1 rounded bg-black border border-[#d4af37] text-white text-xs outline-none"
                                />
                                <button
                                  onClick={() => {
                                    updateDressPrice(dress.id, tempPrice);
                                    setEditingPriceId(null);
                                  }}
                                  className="p-1.5 rounded bg-[#d4af37] text-black hover:bg-[#c99f2e]"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold font-mono text-white">
                                  {formatPrice(dress.price)}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingPriceId(dress.id);
                                    setTempPrice(dress.price);
                                  }}
                                  className="p-1 text-zinc-400 hover:text-white"
                                  title="Edit price"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Sizing Stock Stepper Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-white/5">
                          {dress.sizes.map((s) => (
                            <div
                              key={s.size}
                              className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between"
                            >
                              <div>
                                <span className="text-white font-bold block">{s.size}</span>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                  Stock: <strong className={s.stock <= 2 ? 'text-amber-400' : 'text-zinc-300'}>{s.stock}</strong>
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateDressStock(dress.id, s.size, s.stock - 1)}
                                  className="p-1 rounded bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white"
                                  title="Decrease stock"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => updateDressStock(dress.id, s.size, s.stock + 1)}
                                  className="p-1 rounded bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white"
                                  title="Increase stock"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: SALON FULFILLMENT & TRACKING */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-zinc-400">
                  <p>Client order fulfillment lifecycle & white-glove dispatch routing.</p>
                  <span>{orders.length} active orders</span>
                </div>

                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{ord.orderNumber}</span>
                            <span className="text-zinc-400">&middot; {ord.shippingAddress.fullName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                              {ord.paymentStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {ord.shippingAddress.city}, {ord.shippingAddress.country} &middot; Total: {formatPrice(ord.total)}
                          </p>
                        </div>

                        {/* Status Change Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400 text-[11px]">Fulfillment:</span>
                          <select
                            value={ord.fulfillmentStatus}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                            className="bg-black border border-white/20 text-[#d4af37] font-semibold text-xs rounded px-2.5 py-1.5 outline-none focus:border-[#d4af37]"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Atelier Draping">Atelier Draping</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      <div className="p-2.5 rounded bg-black/40 border border-white/5 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
                        <span>Courier Code: <strong className="text-white">{ord.trackingNumber}</strong></span>
                        <span className="text-zinc-500 truncate max-w-xs">{ord.endToEndCipherSeal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
