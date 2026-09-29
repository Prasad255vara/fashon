import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Eye, ShoppingBag } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const { dresses, setSelectedGalleryDress, addToCart, formatPrice } = useStore();

  const clientMoments = [
    {
      id: 'ugc-1',
      dressId: 'atake-01',
      city: 'PARIS',
      imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'ugc-2',
      dressId: 'atake-02',
      city: 'MILAN',
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'ugc-3',
      dressId: 'atake-03',
      city: 'LONDON',
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'ugc-4',
      dressId: 'atake-08',
      city: 'CANNES',
      imageUrl: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'ugc-5',
      dressId: 'atake-06',
      city: 'NEW YORK',
      imageUrl: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'ugc-6',
      dressId: 'atake-07',
      city: 'TOKYO',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section id="reviews" className="py-12 bg-[#0c0d0f] border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-black uppercase text-white font-display tracking-wider">
              CLIENTS
            </span>
            <div className="flex items-center text-amber-400 gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            5.0 &middot; VERIFIED
          </span>
        </div>

        {/* Visual Client Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-6">
          {clientMoments.map((item) => {
            const dress = dresses.find((d) => d.id === item.dressId) || dresses[0];
            return (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden bg-black border border-white/10 hover:border-[#d4af37]/60 transition-all aspect-[3/4] shadow-lg cursor-pointer"
                onClick={() => setSelectedGalleryDress(dress)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.city}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />

                {/* Top City Badge */}
                <div className="absolute top-2 left-2 z-20">
                  <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[#d4af37] text-[9px] font-mono font-bold tracking-wider">
                    {item.city}
                  </span>
                </div>

                {/* 5 Stars Top Right */}
                <div className="absolute top-2 right-2 z-20 flex items-center text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                </div>

                {/* Bottom Overlay Actions */}
                <div className="absolute bottom-2 inset-x-2 z-20 flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGalleryDress(dress);
                    }}
                    className="p-1.5 rounded-lg bg-black/80 hover:bg-[#d4af37] text-white hover:text-black border border-white/15"
                    title="360°"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(dress, dress.colors[0], 'S');
                    }}
                    className="p-1.5 rounded-lg bg-[#d4af37] hover:bg-[#c99f2e] text-black"
                    title="Quick Buy"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
