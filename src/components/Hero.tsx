import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Eye, ShoppingBag, ChevronLeft, ChevronRight, SlidersHorizontal, Maximize2, Minimize2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { dresses, formatPrice, setSelectedGalleryDress, addToCart } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isFullPersonVisible, setIsFullPersonVisible] = useState(true);

  const heroDresses = dresses.slice(0, 5);
  const activeDress = heroDresses[currentSlide] || dresses[0];
  const activeColor = activeDress?.colors?.[selectedColorIdx] || activeDress?.colors?.[0];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroDresses.length);
    setSelectedColorIdx(0);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + heroDresses.length) % heroDresses.length);
    setSelectedColorIdx(0);
  };

  if (!activeDress) return null;

  const currentPhotoUrl = activeColor?.imageUrl || activeDress.imageUrl;

  return (
    <section id="hero" className="relative w-full bg-[#07080a] overflow-hidden">
      {/* Massive Visual Showcase with Full Person Framing */}
      <div className="relative h-[82vh] min-h-[580px] max-h-[880px] w-full flex items-center justify-center overflow-hidden">
        {/* Ambient Blurred Background Glow */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-3xl opacity-25 scale-110 pointer-events-none transition-all duration-700"
          style={{ backgroundImage: `url(${currentPhotoUrl})` }}
        />

        {/* Real High-Resolution Runway Photo (Selected Element) */}
        <img
          src={currentPhotoUrl}
          alt={activeDress.name}
          referrerPolicy="no-referrer"
          className={`relative z-10 h-full w-full max-w-5xl transition-all duration-500 ease-out select-none ${
            isFullPersonVisible
              ? 'object-contain object-center'
              : 'object-cover object-top'
          }`}
        />

        {/* Subtle Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080a]/90 via-transparent to-black/30 pointer-events-none z-10" />

        {/* Left / Right Large Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-transform hover:scale-110 z-20"
          title="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-transform hover:scale-110 z-20"
          title="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Top Floating Badge & Actions */}
        <div className="absolute top-6 inset-x-6 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#d4af37] font-display font-black text-xs sm:text-sm tracking-[0.2em] uppercase border border-[#d4af37]/50 shadow-2xl">
              {activeDress.brand}
            </span>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-zinc-400 font-mono text-xs border border-white/10">
              0{currentSlide + 1} / 0{heroDresses.length}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Toggle Full Person Visibility vs Zoomed Fit */}
            <button
              onClick={() => setIsFullPersonVisible(!isFullPersonVisible)}
              className="p-3 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 backdrop-blur-md transition-all shadow-xl"
              title={isFullPersonVisible ? 'Zoom In' : 'Full Person View'}
            >
              {isFullPersonVisible ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>

            <a
              href="#compare"
              className="p-3 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 backdrop-blur-md transition-all shadow-xl"
              title="1v1 Compare"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </a>

            <button
              onClick={() => setSelectedGalleryDress(activeDress)}
              className="p-3 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 backdrop-blur-md transition-all shadow-xl"
              title="360° Studio"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Floating Visual Controller */}
        <div className="absolute bottom-6 inset-x-4 sm:inset-x-8 z-20">
          <div className="max-w-xl mx-auto p-3 sm:p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center justify-between gap-4">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                {formatPrice(activeDress.price)}
              </span>
              {activeDress.originalPrice && (
                <span className="text-xs line-through text-zinc-500 font-mono">
                  {formatPrice(activeDress.originalPrice)}
                </span>
              )}
            </div>

            {/* Visual Color Dots */}
            <div className="flex items-center gap-2">
              {activeDress.colors.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    idx === selectedColorIdx
                      ? 'border-[#d4af37] scale-125 ring-2 ring-[#d4af37]/40 shadow-lg'
                      : 'border-white/30 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>

            {/* Direct 1-Tap Bag Button */}
            <button
              onClick={() => addToCart(activeDress, activeColor, 'S')}
              className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c99f2e] text-black font-display font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>S</span>
            </button>
          </div>

          {/* Carousel Slide Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {heroDresses.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentSlide(i);
                  setSelectedColorIdx(0);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === i ? 'w-6 bg-[#d4af37]' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
