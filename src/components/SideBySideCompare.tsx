import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { DressColor } from '../types';
import { ArtworkVisual } from './ArtworkVisual';
import { ArrowLeftRight, ShoppingBag, Eye, Heart, RotateCcw } from 'lucide-react';

export const SideBySideCompare: React.FC = () => {
  const {
    dresses,
    formatPrice,
    addToCart,
    compareDressAId,
    compareDressBId,
    setCompareDressAId,
    setCompareDressBId,
    toggleWishlist,
    isWishlisted,
    setSelectedGalleryDress,
  } = useStore();

  const dressA = dresses.find((d) => d.id === compareDressAId) || dresses[0];
  const dressB = dresses.find((d) => d.id === compareDressBId) || dresses[1] || dresses[0];

  const [colorA, setColorA] = useState<DressColor>(() => dressA?.colors?.[0]);
  const [sizeA, setSizeA] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('S');
  const [angleA, setAngleA] = useState<'front' | 'profile' | 'back' | 'macro'>('front');
  const [rotationA, setRotationA] = useState<number>(0);

  const [colorB, setColorB] = useState<DressColor>(() => dressB?.colors?.[0]);
  const [sizeB, setSizeB] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('S');
  const [angleB, setAngleB] = useState<'front' | 'profile' | 'back' | 'macro'>('front');
  const [rotationB, setRotationB] = useState<number>(0);

  React.useEffect(() => {
    if (dressA?.colors?.[0]) setColorA(dressA.colors[0]);
  }, [dressA?.id]);

  React.useEffect(() => {
    if (dressB?.colors?.[0]) setColorB(dressB.colors[0]);
  }, [dressB?.id]);

  const swapComparison = () => {
    const tempA = dressA.id;
    const tempB = dressB.id;
    setCompareDressAId(tempB);
    setCompareDressBId(tempA);
  };

  return (
    <section id="compare" className="py-12 bg-[#0e1014] border-t border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Visual Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-black uppercase text-white font-display tracking-wider">
              1V1
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span className="text-xs font-display font-black text-[#d4af37] tracking-[0.2em] uppercase">
              {dressA.brand} VS {dressB.brand}
            </span>
          </div>

          <button
            onClick={swapComparison}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-mono transition-colors"
            title="Swap"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>SWAP</span>
          </button>
        </div>

        {/* 2-Column Visual Split Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
          {/* COLUMN A */}
          <div className="space-y-4 rounded-2xl bg-zinc-900/60 border border-white/10 p-4 sm:p-6 shadow-2xl">
            {/* Quick Dress Selector Dropdown */}
            <div className="flex items-center justify-between gap-3">
              <select
                value={dressA.id}
                onChange={(e) => setCompareDressAId(e.target.value)}
                className="w-full bg-black/60 border border-white/15 text-white text-xs font-mono rounded-lg px-3 py-2 outline-none focus:border-[#d4af37]"
              >
                {dresses.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.brand} — {d.name} ({formatPrice(d.price)})
                  </option>
                ))}
              </select>

              <button
                onClick={() => toggleWishlist(dressA.id)}
                className="p-2 rounded-lg bg-black/60 border border-white/15 text-white hover:text-rose-400"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted(dressA.id) ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'
                  }`}
                />
              </button>
            </div>

            {/* Photo Viewport */}
            <div className="relative aspect-[3/4] bg-black rounded-xl overflow-hidden border border-white/10 group">
              <ArtworkVisual
                silhouette={dressA.silhouette}
                color={colorA}
                customImageUrl={
                  angleA === 'front'
                    ? colorA?.imageUrl || dressA?.galleryImages?.[0] || dressA?.imageUrl || ''
                    : angleA === 'profile'
                    ? dressA?.galleryImages?.[1] || colorA?.imageUrl || dressA?.imageUrl || ''
                    : angleA === 'back'
                    ? dressA?.galleryImages?.[2] || colorA?.imageUrl || dressA?.imageUrl || ''
                    : dressA?.galleryImages?.[3] || colorA?.imageUrl || dressA?.imageUrl || ''
                }
                angle={angleA}
                rotationDeg={rotationA}
                aspectRatioClass="aspect-[3/4]"
              />

              {/* Floating Brand & Price */}
              <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1">
                <span className="px-2.5 py-0.5 rounded bg-black/85 backdrop-blur-md text-[#d4af37] font-display font-black text-[10px] tracking-widest uppercase border border-[#d4af37]/40 shadow-lg">
                  {dressA.brand}
                </span>
                <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-white font-mono font-bold text-xs border border-white/10 shadow-lg">
                  {formatPrice(dressA.price)}
                </span>
              </div>

              {/* 360 Studio Modal Trigger */}
              <div className="absolute top-3 right-3 z-20">
                <button
                  onClick={() => setSelectedGalleryDress(dressA)}
                  className="p-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/15"
                  title="360° Studio"
                >
                  <Eye className="w-4 h-4 text-[#d4af37]" />
                </button>
              </div>

              {/* Angle Switcher Overlay */}
              <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-center gap-1.5 p-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10">
                {(['front', 'profile', 'back', 'macro'] as const).map((ang) => (
                  <button
                    key={ang}
                    onClick={() => {
                      setAngleA(ang);
                      setRotationA(0);
                    }}
                    className={`px-3 py-1 rounded text-[11px] font-mono uppercase font-bold transition-all ${
                      angleA === ang
                        ? 'bg-[#d4af37] text-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {ang}
                  </button>
                ))}
              </div>
            </div>

            {/* 360 Slider */}
            <div className="flex items-center gap-3 px-1">
              <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={rotationA}
                onChange={(e) => setRotationA(Number(e.target.value))}
                className="w-full accent-[#d4af37] bg-zinc-800 h-1.5 rounded cursor-pointer"
              />
              <span className="text-xs font-mono text-[#d4af37] w-10 text-right">
                {rotationA}°
              </span>
            </div>

            {/* Color Swatches */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {dressA.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColorA(c)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      colorA.id === c.id
                        ? 'border-[#d4af37] scale-125 ring-2 ring-[#d4af37]/40 shadow-md'
                        : 'border-white/20 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                {(['XS', 'S', 'M', 'L', 'XL'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSizeA(sz)}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                      sizeA === sz
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Add to Bag */}
            <button
              onClick={() => addToCart(dressA, colorA, sizeA)}
              className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#c99f2e] text-black font-display font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{formatPrice(dressA.price)} &middot; {sizeA}</span>
            </button>
          </div>

          {/* COLUMN B */}
          <div className="space-y-4 rounded-2xl bg-zinc-900/60 border border-white/10 p-4 sm:p-6 shadow-2xl">
            {/* Quick Dress Selector Dropdown */}
            <div className="flex items-center justify-between gap-3">
              <select
                value={dressB.id}
                onChange={(e) => setCompareDressBId(e.target.value)}
                className="w-full bg-black/60 border border-white/15 text-white text-xs font-mono rounded-lg px-3 py-2 outline-none focus:border-[#d4af37]"
              >
                {dresses.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.brand} — {d.name} ({formatPrice(d.price)})
                  </option>
                ))}
              </select>

              <button
                onClick={() => toggleWishlist(dressB.id)}
                className="p-2 rounded-lg bg-black/60 border border-white/15 text-white hover:text-rose-400"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted(dressB.id) ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'
                  }`}
                />
              </button>
            </div>

            {/* Photo Viewport */}
            <div className="relative aspect-[3/4] bg-black rounded-xl overflow-hidden border border-white/10 group">
              <ArtworkVisual
                silhouette={dressB.silhouette}
                color={colorB}
                customImageUrl={
                  angleB === 'front'
                    ? colorB?.imageUrl || dressB?.galleryImages?.[0] || dressB?.imageUrl || ''
                    : angleB === 'profile'
                    ? dressB?.galleryImages?.[1] || colorB?.imageUrl || dressB?.imageUrl || ''
                    : angleB === 'back'
                    ? dressB?.galleryImages?.[2] || colorB?.imageUrl || dressB?.imageUrl || ''
                    : dressB?.galleryImages?.[3] || colorB?.imageUrl || dressB?.imageUrl || ''
                }
                angle={angleB}
                rotationDeg={rotationB}
                aspectRatioClass="aspect-[3/4]"
              />

              {/* Floating Brand & Price */}
              <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1">
                <span className="px-2.5 py-0.5 rounded bg-black/85 backdrop-blur-md text-[#d4af37] font-display font-black text-[10px] tracking-widest uppercase border border-[#d4af37]/40 shadow-lg">
                  {dressB.brand}
                </span>
                <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-white font-mono font-bold text-xs border border-white/10 shadow-lg">
                  {formatPrice(dressB.price)}
                </span>
              </div>

              {/* 360 Studio Modal Trigger */}
              <div className="absolute top-3 right-3 z-20">
                <button
                  onClick={() => setSelectedGalleryDress(dressB)}
                  className="p-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/15"
                  title="360° Studio"
                >
                  <Eye className="w-4 h-4 text-[#d4af37]" />
                </button>
              </div>

              {/* Angle Switcher Overlay */}
              <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-center gap-1.5 p-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10">
                {(['front', 'profile', 'back', 'macro'] as const).map((ang) => (
                  <button
                    key={ang}
                    onClick={() => {
                      setAngleB(ang);
                      setRotationB(0);
                    }}
                    className={`px-3 py-1 rounded text-[11px] font-mono uppercase font-bold transition-all ${
                      angleB === ang
                        ? 'bg-[#d4af37] text-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {ang}
                  </button>
                ))}
              </div>
            </div>

            {/* 360 Slider */}
            <div className="flex items-center gap-3 px-1">
              <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={rotationB}
                onChange={(e) => setRotationB(Number(e.target.value))}
                className="w-full accent-[#d4af37] bg-zinc-800 h-1.5 rounded cursor-pointer"
              />
              <span className="text-xs font-mono text-[#d4af37] w-10 text-right">
                {rotationB}°
              </span>
            </div>

            {/* Color Swatches */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {dressB.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColorB(c)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      colorB.id === c.id
                        ? 'border-[#d4af37] scale-125 ring-2 ring-[#d4af37]/40 shadow-md'
                        : 'border-white/20 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                {(['XS', 'S', 'M', 'L', 'XL'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSizeB(sz)}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                      sizeB === sz
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Add to Bag */}
            <button
              onClick={() => addToCart(dressB, colorB, sizeB)}
              className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#c99f2e] text-black font-display font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{formatPrice(dressB.price)} &middot; {sizeB}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
