import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const AnnouncementTicker: React.FC = () => {
  const announcements = [
    '✨ 10% OFF &middot; CODE: <b>SNITCH10</b>',
    '⚡ 1V1 SIDE-BY-SIDE DRAPE VIEWER',
    '✈️ FREE WHITE-GLOVE COURIER',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-gradient-to-r from-zinc-950 via-[#181610] to-zinc-950 border-b border-white/[0.08] text-white py-2 px-4 relative overflow-hidden z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
        <div className="flex-1 text-center truncate">
          <span
            className="inline-block transition-all duration-500 transform text-zinc-300 tracking-wider text-[11px]"
            dangerouslySetInnerHTML={{ __html: announcements[currentIndex] }}
          />
        </div>

        {/* Quick Voucher Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-4">
          <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#fcf6ba] text-[10px] font-bold tracking-widest border border-[#d4af37]/40 uppercase">
            SNITCH10
          </span>
        </div>
      </div>
    </div>
  );
};
