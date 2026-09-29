import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Layers, SlidersHorizontal, Heart, ShoppingBag } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { cartCount, wishlist, setIsCartOpen } = useStore();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0e1014]/95 backdrop-blur-lg border-t border-white/10 px-4 py-2.5 flex items-center justify-around text-zinc-400">
      {/* Home */}
      <a
        href="#hero"
        className="flex flex-col items-center gap-1 hover:text-white transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px] font-mono font-medium">Home</span>
      </a>

      {/* Catalog */}
      <a
        href="#collection"
        className="flex flex-col items-center gap-1 hover:text-white transition-colors"
      >
        <Layers className="w-4 h-4" />
        <span className="text-[10px] font-mono font-medium">Dresses</span>
      </a>

      {/* Compare Side-by-Side (Flagship) */}
      <a
        href="#compare"
        className="flex flex-col items-center gap-1 text-[#d4af37] transition-colors relative"
      >
        <div className="relative">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
        </div>
        <span className="text-[10px] font-mono font-bold">Compare</span>
      </a>

      {/* Wishlist */}
      <a
        href="#collection"
        className="flex flex-col items-center gap-1 hover:text-white transition-colors relative"
      >
        <div className="relative">
          <Heart className="w-4 h-4" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-rose-500 text-white text-[8px] font-mono rounded-full">
              {wishlist.length}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono font-medium">Saved</span>
      </a>

      {/* Bag */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-1 hover:text-white transition-colors relative"
      >
        <div className="relative">
          <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-[#d4af37] text-black font-bold text-[8px] font-mono rounded-full">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono font-medium">Bag</span>
      </button>
    </nav>
  );
};
