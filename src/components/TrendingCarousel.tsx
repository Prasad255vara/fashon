import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, Eye, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { ArtworkVisual } from './ArtworkVisual';

export const TrendingCarousel: React.FC = () => {
  const { dresses, formatPrice, setSelectedGalleryDress, addToCart, setCompareDressBId } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 bg-[#0a0b0d] border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Controls */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm font-black uppercase text-white font-mono tracking-widest">
              DROPS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-white/10 hover:border-white/30 bg-black/50 text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-white/10 hover:border-white/30 bg-black/50 text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Visual Carousel Track */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
        >
          {dresses.map((dress) => {
            const firstColor = dress?.colors?.[0] || {
              id: 'default',
              name: 'Noir',
              hex: '#111215',
              accentHex: '#d4af37',
              pantoneCode: 'PANTONE 19-4007 TCX',
              imageUrl: dress?.imageUrl,
            };
            return (
              <div
                key={`trending-${dress.id}`}
                className="w-56 sm:w-64 flex-shrink-0 snap-start rounded-2xl bg-zinc-900 border border-white/10 hover:border-[#d4af37]/50 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
              >
                {/* Visual Image */}
                <div className="relative aspect-[3/4] bg-black overflow-hidden">
                  <ArtworkVisual
                    silhouette={dress.silhouette}
                    color={firstColor}
                    aspectRatioClass="aspect-[3/4]"
                  />

                  {/* Top Pill: Brand & Price */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex flex-col items-start gap-1">
                    <span className="px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-[#d4af37] font-display font-black text-[9px] tracking-wider uppercase border border-[#d4af37]/40 shadow-lg">
                      {dress.brand}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-white font-mono font-bold text-xs border border-white/10 shadow-lg">
                      {formatPrice(dress.price)}
                    </span>
                  </div>

                  {/* Interactive Buttons */}
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
                    <button
                      onClick={() => setSelectedGalleryDress(dress)}
                      className="p-1.5 rounded-full bg-black/75 hover:bg-black text-white border border-white/15"
                      title="360°"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                    </button>
                    <button
                      onClick={() => setCompareDressBId(dress.id)}
                      className="p-1.5 rounded-full bg-black/75 hover:bg-black text-white border border-white/15"
                      title="1v1"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 1-Tap Quick Add S on Hover */}
                  <div className="absolute bottom-2.5 inset-x-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => addToCart(dress, firstColor, 'S')}
                      className="w-full py-2 rounded-xl bg-[#d4af37] hover:bg-[#c99f2e] text-black font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>S</span>
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
