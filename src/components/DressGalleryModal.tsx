import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArtworkVisual } from './ArtworkVisual';
import { DressColor } from '../types';
import {
  X,
  Sparkles,
  ShoppingBag,
  Ruler,
  Check,
  ShieldCheck,
  RotateCw,
  Camera,
} from 'lucide-react';

export const DressGalleryModal: React.FC = () => {
  const {
    selectedGalleryDress,
    setSelectedGalleryDress,
    formatPrice,
    addToCart,
    t,
  } = useStore();

  if (!selectedGalleryDress) return null;

  const dress = selectedGalleryDress;
  const [selectedColor, setSelectedColor] = useState<DressColor>(
    () => dress?.colors?.[0] || { id: 'default', name: 'Noir', hex: '#111215', accentHex: '#d4af37', pantoneCode: 'PANTONE 19-4007 TCX' }
  );
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('S');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [showSizeTable, setShowSizeTable] = useState(false);

  const galleryList = (dress?.galleryImages && dress.galleryImages.length > 0)
    ? dress.galleryImages
    : [selectedColor?.imageUrl || dress?.imageUrl || ''].filter(Boolean);

  const currentPhoto = galleryList[activePhotoIndex] || galleryList[0] || dress?.imageUrl || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#111216] border border-white/15 rounded-2xl shadow-2xl flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setSelectedGalleryDress(null)}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/15 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: High-Resolution Real Dress Photography Stage */}
        <div className="lg:w-7/12 p-6 flex flex-col justify-between bg-black/60 border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black">
              <ArtworkVisual
                silhouette={dress.silhouette}
                color={selectedColor}
                customImageUrl={currentPhoto}
                rotationDeg={rotationDeg}
                aspectRatioClass="aspect-[3/4]"
              />

              {/* Tag indicator */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
                <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Angle {activePhotoIndex + 1} of {galleryList.length}</span>
              </div>
            </div>

            {/* Thumbnail Angle Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {galleryList.map((photoUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border flex-shrink-0 transition-all ${
                    activePhotoIndex === idx
                      ? 'border-[#d4af37] ring-2 ring-[#d4af37]/40 scale-105'
                      : 'border-white/15 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt={`Angle ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 360 Degree Interactive Rotation Slider */}
          <div className="mt-4 space-y-1.5 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <RotateCw className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Studio 360° Perspective Drag</span>
              </span>
              <span className="text-[#d4af37]">{rotationDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={rotationDeg}
              onChange={(e) => setRotationDeg(Number(e.target.value))}
              className="w-full accent-[#d4af37] bg-zinc-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Right Side: Editorial Notes, Sizing, Measurements & Order Action */}
        <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fcf6ba] text-xs font-display font-black tracking-[0.2em] uppercase">
                  {dress.brand}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                  {dress.collection}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-display mt-1">
                {dress.name}
              </h2>
              <p className="text-xs text-zinc-400 italic font-serif-brand mt-0.5">
                {dress.frenchTitle} &middot; {dress.sku}
              </p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold font-mono text-white">
                {formatPrice(dress.price)}
              </span>
              {dress.originalPrice && (
                <span className="text-sm line-through text-zinc-500 font-mono">
                  {formatPrice(dress.originalPrice)}
                </span>
              )}
              {dress.discountPercent && (
                <span className="text-xs font-mono text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/20">
                  {dress.discountPercent}% OFF
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-mono">
              {dress.description}
            </p>

            {/* Color selection with real image sync */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Colorway:</span>
                <span className="text-white font-semibold">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {dress.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedColor(c);
                      setActivePhotoIndex(0);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                      selectedColor.id === c.id
                        ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                        : 'border-white/10 hover:border-white/20 text-zinc-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/40"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sizing selection with Size Guide Toggle */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Size (Atelier Standard):</span>
                <button
                  onClick={() => setShowSizeTable(!showSizeTable)}
                  className="flex items-center gap-1 text-[#d4af37] hover:underline text-[11px]"
                >
                  <Ruler className="w-3 h-3" />
                  <span>{showSizeTable ? 'Hide Table' : 'Measurement Guide'}</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {dress.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    className={`py-2 text-xs font-mono rounded border transition-all ${
                      selectedSize === s.size
                        ? 'border-[#d4af37] bg-[#d4af37] text-black font-bold'
                        : s.stock === 0
                        ? 'border-white/5 text-zinc-600 cursor-not-allowed'
                        : 'border-white/10 text-zinc-300 hover:border-white/30'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>

              {/* Sizing Measurement Sheet */}
              {showSizeTable && (
                <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono space-y-1.5 animate-in fade-in">
                  <div className="grid grid-cols-4 text-zinc-400 border-b border-white/10 pb-1">
                    <span>Size</span>
                    <span>Bust</span>
                    <span>Waist</span>
                    <span>Length</span>
                  </div>
                  {dress.sizes.map((s) => (
                    <div
                      key={s.size}
                      className={`grid grid-cols-4 py-0.5 ${
                        s.size === selectedSize ? 'text-[#d4af37] font-semibold' : 'text-zinc-300'
                      }`}
                    >
                      <span>{s.size}</span>
                      <span>{s.bustCm} cm</span>
                      <span>{s.waistCm} cm</span>
                      <span>{s.lengthCm} cm</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Visual Specs */}
            <div className="flex items-center justify-between py-2 text-xs font-mono text-zinc-400 border-t border-white/10">
              <span>{dress.silhouette}</span>
              <span className="text-[#d4af37]">{dress.drapeWeightGsm} GSM</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="space-y-2 pt-4">
            <button
              onClick={() => {
                addToCart(dress, selectedColor, selectedSize);
                setSelectedGalleryDress(null);
              }}
              className="w-full py-4 rounded-xl bg-[#d4af37] hover:bg-[#c99f2e] text-black font-display font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Acquire This Real Haute Piece ({formatPrice(dress.price)})</span>
            </button>
            <p className="text-[10px] text-center text-zinc-500 font-mono">
              Complimentary White-Glove Courier &middot; 7-Day Exchange
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
