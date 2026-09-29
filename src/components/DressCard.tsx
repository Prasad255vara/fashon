import React, { useState } from 'react';
import { Dress, DressColor } from '../types';
import { useStore } from '../context/StoreContext';
import { ArtworkVisual } from './ArtworkVisual';
import { Heart, Eye, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

interface DressCardProps {
  dress: Dress;
}

export const DressCard: React.FC<DressCardProps> = ({ dress }) => {
  const {
    formatPrice,
    addToCart,
    isWishlisted,
    toggleWishlist,
    setSelectedGalleryDress,
    setCompareDressBId,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState<DressColor>(
    () => dress?.colors?.[0] || {
      id: 'default',
      name: 'Noir',
      hex: '#111215',
      accentHex: '#d4af37',
      pantoneCode: 'PANTONE 19-4007 TCX',
      imageUrl: dress?.imageUrl,
    }
  );

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const favorited = isWishlisted(dress.id);

  const photoList = (dress.galleryImages && dress.galleryImages.length > 0)
    ? dress.galleryImages
    : [selectedColor?.imageUrl || dress?.imageUrl || ''];

  const currentPhoto = photoList[activePhotoIdx] || selectedColor?.imageUrl || dress?.imageUrl;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev + 1) % photoList.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev - 1 + photoList.length) % photoList.length);
  };

  const handleQuickAdd = (size: 'XS' | 'S' | 'M' | 'L' | 'XL', e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(dress, selectedColor, size);
  };

  const sizesList = dress?.sizes || [];
  const colorsList = dress?.colors || [];

  return (
    <div
      className="group relative rounded-2xl bg-[#121317] border border-white/10 hover:border-[#d4af37]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Image Container with Multi-Photo Switcher */}
      <div className="relative overflow-hidden bg-black aspect-[3/4]">
        <ArtworkVisual
          silhouette={dress.silhouette}
          color={selectedColor}
          customImageUrl={currentPhoto}
          aspectRatioClass="aspect-[3/4]"
        />

        {/* Top Badges (Brand / Discount Pill & Heart Icon) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[#d4af37] font-display font-black text-[9px] sm:text-[10px] tracking-widest uppercase border border-[#d4af37]/40 shadow-lg">
              {dress.brand}
            </span>
            {dress.discountPercent ? (
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono font-bold text-[9px] shadow-lg">
                -{dress.discountPercent}%
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGalleryDress(dress);
              }}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:text-[#d4af37] transition-colors"
              title="360°"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setCompareDressBId(dress.id);
              }}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:text-[#d4af37] transition-colors"
              title="Compare 1v1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(dress.id);
              }}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:text-rose-400 transition-colors"
              title={favorited ? 'Wishlisted' : 'Wishlist'}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  favorited ? 'fill-rose-500 text-rose-500' : 'text-zinc-300'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Interactive Hover Arrows for Photo Browsing */}
        {photoList.length > 1 && (
          <div
            className={`absolute inset-y-0 inset-x-2 flex items-center justify-between z-20 pointer-events-none transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={handlePrevPhoto}
              className="p-1.5 rounded-full bg-black/70 hover:bg-black text-white pointer-events-auto border border-white/20 transition-colors shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextPhoto}
              className="p-1.5 rounded-full bg-black/70 hover:bg-black text-white pointer-events-auto border border-white/20 transition-colors shadow-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Photo Dots */}
        {photoList.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full pointer-events-none">
            {photoList.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${
                  activePhotoIdx === i ? 'w-3 bg-[#d4af37]' : 'w-1 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Info: Minimal, Visual Swatches & 1-Tap Size Buttons */}
      <div className="p-3.5 space-y-2 bg-[#121317]">
        {/* Brand Name */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-display font-black tracking-[0.2em] text-[#d4af37] uppercase">
            {dress.brand}
          </span>
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
            {dress.silhouette}
          </span>
        </div>

        {/* Row 1: Price & Color Dots */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold font-mono text-white">
              {formatPrice(dress.price)}
            </span>
            {dress.originalPrice && (
              <span className="text-xs line-through text-zinc-500 font-mono">
                {formatPrice(dress.originalPrice)}
              </span>
            )}
          </div>

          {/* Colorway Swatches */}
          <div className="flex items-center gap-1.5">
            {colorsList.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedColor(c);
                  setActivePhotoIdx(0);
                }}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColor.id === c.id
                    ? 'border-[#d4af37] scale-125 shadow-md ring-2 ring-[#d4af37]/40'
                    : 'border-white/20 hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Row 2: 1-Tap Size Pills (XS, S, M, L, XL) */}
        <div className="grid grid-cols-5 gap-1 pt-1">
          {sizesList.map((s) => (
            <button
              key={s.size}
              disabled={s.stock === 0}
              onClick={(e) => handleQuickAdd(s.size, e)}
              className={`py-1 rounded text-[11px] font-mono font-bold transition-all ${
                s.stock === 0
                  ? 'bg-zinc-900/60 text-zinc-600 border border-white/5 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-[#d4af37] text-zinc-200 hover:text-black border border-white/10'
              }`}
              title={s.stock === 0 ? 'Out' : `Add ${s.size}`}
            >
              {s.size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
