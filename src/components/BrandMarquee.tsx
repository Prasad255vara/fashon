import React from 'react';
import { LUXURY_BRANDS } from '../data/dresses';

interface BrandMarqueeProps {
  selectedBrand?: string | null;
  onSelectBrand?: (brand: string | null) => void;
}

export const BrandMarquee: React.FC<BrandMarqueeProps> = ({
  selectedBrand,
  onSelectBrand,
}) => {
  return (
    <div className="bg-[#08090b] py-3.5 border-b border-white/[0.08] overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 sm:gap-8 justify-start sm:justify-center min-w-max">
          <button
            onClick={() => onSelectBrand?.(null)}
            className={`text-xs font-mono tracking-[0.25em] uppercase font-bold transition-all ${
              !selectedBrand
                ? 'text-[#d4af37] border-b border-[#d4af37] pb-0.5'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            ALL HOUSES
          </button>

          {LUXURY_BRANDS.map((brand, idx) => {
            const isSelected = selectedBrand === brand;
            return (
              <React.Fragment key={brand}>
                <span className="text-zinc-700 text-[10px] select-none">&bull;</span>
                <button
                  onClick={() => onSelectBrand?.(isSelected ? null : brand)}
                  className={`text-xs font-display tracking-[0.2em] uppercase font-black transition-all ${
                    isSelected
                      ? 'text-[#fcf6ba] border-b border-[#d4af37] scale-105'
                      : 'text-zinc-400 hover:text-white hover:scale-105'
                  }`}
                >
                  {brand}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
