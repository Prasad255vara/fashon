import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Camera, Eye, ShoppingBag } from 'lucide-react';

export const RunwayLookbook: React.FC = () => {
  const { dresses, setSelectedGalleryDress, formatPrice, addToCart } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'paris' | 'redcarpet'>('all');

  const photos = [
    {
      id: 'p-1',
      imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
      dressId: 'atake-01',
      tag: 'PARIS',
    },
    {
      id: 'p-2',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      dressId: 'atake-07',
      tag: 'EDITORIAL',
    },
    {
      id: 'p-3',
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
      dressId: 'atake-03',
      tag: 'GALA',
    },
    {
      id: 'p-4',
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=85',
      dressId: 'atake-02',
      tag: 'MILAN',
    },
    {
      id: 'p-5',
      imageUrl: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=85',
      dressId: 'atake-08',
      tag: 'CANNES',
    },
    {
      id: 'p-6',
      imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1200&q=85',
      dressId: 'atake-04',
      tag: 'RESORT',
    },
    {
      id: 'p-7',
      imageUrl: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=1200&q=85',
      dressId: 'atake-06',
      tag: 'HAUTE',
    },
    {
      id: 'p-8',
      imageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=85',
      dressId: 'atake-09',
      tag: 'ATELIER',
    },
    {
      id: 'p-9',
      imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85',
      dressId: 'atake-10',
      tag: 'PARIS',
    },
  ];

  const filtered = photos.filter((p) => {
    if (activeTab === 'paris') return p.tag === 'PARIS' || p.tag === 'HAUTE';
    if (activeTab === 'redcarpet') return p.tag === 'GALA' || p.tag === 'CANNES';
    return true;
  });

  return (
    <section id="lookbook" className="py-12 bg-[#090a0d] border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#d4af37]" />
            <span className="text-xl sm:text-2xl font-black uppercase text-white font-display tracking-wider">
              LOOKBOOK
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'ALL' },
              { id: 'paris', label: 'RUNWAY' },
              { id: 'redcarpet', label: 'RED CARPET' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pure High-Resolution Photo Masonry */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
          {filtered.map((item, idx) => {
            const dress = dresses.find((d) => d.id === item.dressId) || dresses[0];
            return (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden bg-black border border-white/10 hover:border-[#d4af37]/60 transition-all duration-300 shadow-xl cursor-pointer"
                style={{
                  minHeight: idx % 3 === 1 ? '420px' : '360px',
                }}
                onClick={() => setSelectedGalleryDress(dress)}
              >
                <img
                  src={item.imageUrl}
                  alt="Runway"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Subtle vignette on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Top Badges (Brand & Tag) */}
                <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-[#d4af37] font-display font-black text-[9px] sm:text-[10px] tracking-widest uppercase border border-[#d4af37]/40 shadow-lg">
                    {dress.brand}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[#fcf6ba] text-[9px] font-mono font-bold tracking-wider uppercase border border-white/15">
                    {item.tag}
                  </span>
                </div>

                {/* Hover Action Bar */}
                <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white font-mono font-bold text-xs border border-white/15">
                    {formatPrice(dress.price)}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGalleryDress(dress);
                      }}
                      className="p-2 rounded-lg bg-black/80 hover:bg-[#d4af37] text-white hover:text-black border border-white/15 transition-colors"
                      title="360°"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(dress, dress.colors[0], 'S');
                      }}
                      className="p-2 rounded-lg bg-[#d4af37] hover:bg-[#c99f2e] text-black transition-colors"
                      title="Quick Buy"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
