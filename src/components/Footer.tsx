import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Lock, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, setIsAdminOpen, setIsAuthOpen, isOnline } = useStore();

  return (
    <footer className="bg-[#08080a] border-t border-white/[0.08] text-zinc-400 text-xs font-mono py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <span className="text-xl font-black uppercase text-white font-display tracking-widest">
              ATAKÉ
            </span>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37]">
              Haute Couture & Runway
            </p>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Maison fondée en 2026. Hand-draped architectural gowns, liquid silk bias slips, and structured corsetry.
            </p>
          </div>

          {/* Column 2: Salons */}
          <div className="space-y-2">
            <h4 className="text-white uppercase font-bold text-xs">Private Salons</h4>
            <ul className="space-y-1.5 text-zinc-500 text-[11px]">
              <li>Paris &middot; 24 Rue du Faubourg Saint-Honoré</li>
              <li>Milano &middot; 12 Via Monte Napoleone</li>
              <li>New York &middot; 780 Madison Avenue</li>
              <li>Tokyo &middot; 5-7-1 Ginza, Chuo-ku</li>
            </ul>
          </div>

          {/* Column 3: Trust & Encryption */}
          <div className="space-y-2">
            <h4 className="text-white uppercase font-bold text-xs">Security & Compliance</h4>
            <div className="space-y-2 text-zinc-500 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AES-256 E2EE End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Two-Factor Authentication (2FA) Protected</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Automated Cross-Border VAT & Duties Engine</span>
              </div>
            </div>
          </div>

          {/* Column 4: Quick Portals */}
          <div className="space-y-2">
            <h4 className="text-white uppercase font-bold text-xs">Atelier Portals</h4>
            <div className="flex flex-col gap-1.5 text-[11px]">
              <a href="#compare" className="hover:text-white transition-colors">
                Side-by-Side Dress Comparison
              </a>
              <a href="#collection" className="hover:text-white transition-colors">
                Runway Collection Catalog
              </a>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="text-left hover:text-white transition-colors"
              >
                VIP Member Vault & RBAC
              </button>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="text-left text-[#d4af37] hover:underline"
              >
                Inventory & Analytics Console
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-600">
          <p>&copy; 2026 ATAKÉ ATELIER Inc. All rights reserved. Registered Paris Haute Couture Syndicate.</p>
          <div className="flex items-center gap-4">
            <span>Complimentary Global White-Glove Dispatch</span>
            <span aria-hidden="true">&middot;</span>
            <span className={isOnline ? 'text-emerald-500' : 'text-amber-500'}>
              {isOnline ? 'Network Online' : 'Offline Cache Mode'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
