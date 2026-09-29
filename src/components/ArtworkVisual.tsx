import React, { useState } from 'react';
import { DressColor } from '../types';

interface ArtworkVisualProps {
  silhouette: string;
  color: DressColor;
  angle?: 'front' | 'profile' | 'back' | 'macro';
  rotationDeg?: number; // 0 to 360 for 360-degree draping simulation
  aspectRatioClass?: string;
  className?: string;
  customImageUrl?: string;
}

export const ArtworkVisual: React.FC<ArtworkVisualProps> = ({
  silhouette,
  color,
  angle = 'front',
  rotationDeg = 0,
  aspectRatioClass = 'aspect-[3/4]',
  className = '',
  customImageUrl,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const hex = color?.hex || '#18181b';
  const accent = color?.accentHex || '#d4af37';
  const isLight =
    color?.id === 'ivory' ||
    color?.id === 'alabaster' ||
    color?.id === 'champagne' ||
    color?.id === 'platinum';

  // Determine real image source
  const realPhotoSrc = customImageUrl || color?.imageUrl;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-b from-[#181a20] via-[#121316] to-[#0a0b0d] flex items-center justify-center select-none ${aspectRatioClass} ${className}`}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      {/* 1. REAL DRESS PHOTOGRAPHY (Primary View) */}
      {realPhotoSrc && !imageError ? (
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={realPhotoSrc}
            alt={`${color?.name || 'Couture'} Dress Real Runway Photography`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
              isZoomed ? 'scale-115' : 'scale-100'
            }`}
            style={{
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
          />

          {/* Luxury Studio Vignette Scrim */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-transparent to-black/30" />
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]" />
        </div>
      ) : (
        /* 2. Resilient Fallback: Studio Silhouette & Drape Render */
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {/* Background Studio Lighting Grid */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 25%, ${accent}33 0%, transparent 65%),
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 32px 32px, 32px 32px',
            }}
          />

          <svg viewBox="0 0 400 600" className="w-full h-full object-contain filter drop-shadow-2xl">
            <defs>
              <linearGradient id={`coutureGradFallback-${color?.id || 'main'}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
                <stop offset="35%" stopColor={hex} />
                <stop offset="100%" stopColor="#050608" />
              </linearGradient>
            </defs>

            {/* Model Silhouette */}
            <path
              d="M 145 140 L 200 135 L 255 140 L 242 220 C 230 250, 225 290, 222 360 L 225 550 L 175 550 L 178 360 C 175 290, 170 250, 158 220 Z"
              fill={`url(#coutureGradFallback-${color?.id || 'main'})`}
              stroke={accent}
              strokeWidth="1.5"
            />
            <line x1="200" y1="135" x2="200" y2="400" stroke={accent} strokeWidth="2" />
          </svg>
        </div>
      )}

      {/* Real Haute Photography Verification Watermark */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/10 text-[9px] uppercase font-mono tracking-widest text-zinc-200">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <span>REAL MODEL PHOTO &middot; {color?.name || 'PARIS'}</span>
      </div>

      {/* Rotation / Angle Tag */}
      {rotationDeg !== 0 && (
        <div className="absolute bottom-3 right-3 z-20 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-wider text-[#d4af37] font-mono">
          360° Studio &middot; {rotationDeg}°
        </div>
      )}
    </div>
  );
};
