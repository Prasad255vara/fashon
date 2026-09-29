import React, { useState } from 'react';
import { useStore, CURRENCIES } from '../context/StoreContext';
import { SupportedLanguage } from '../data/translations';
import {
  ShoppingBag,
  Bell,
  User as UserIcon,
  ShieldCheck,
  Wifi,
  WifiOff,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  Search,
  Heart,
  X,
  Sparkles,
  Camera,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    t,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsAuthOpen,
    setIsAdminOpen,
    setIsNotificationOpen,
    unreadNotificationCount,
    user,
    currency,
    setCurrencyCode,
    language,
    setLanguage,
    isOnline,
    offlineQueueCount,
    syncOfflineQueue,
    dresses,
    setSelectedGalleryDress,
  } = useStore();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchWord, setSearchWord] = useState('');

  const searchResults = searchWord.trim()
    ? dresses.filter(
        (d) =>
          d.name.toLowerCase().includes(searchWord.toLowerCase()) ||
          d.fabric.toLowerCase().includes(searchWord.toLowerCase()) ||
          d.silhouette.toLowerCase().includes(searchWord.toLowerCase())
      )
    : [];

  const languageLabels: Record<SupportedLanguage, string> = {
    en: 'EN',
    fr: 'FR',
    it: 'IT',
    es: 'ES',
    ja: 'JA',
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0c0d0f]/95 backdrop-blur-md border-b border-white/[0.08] transition-colors">
        {/* Top micro-bar: Offline state & Security Indicator */}
        {!isOnline && (
          <div className="bg-amber-950/80 border-b border-amber-500/30 px-4 py-1.5 flex items-center justify-between text-xs text-amber-200 font-mono">
            <div className="flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{t('offline_sync_active')} &middot; {offlineQueueCount} edits pending sync</span>
            </div>
            <button
              onClick={syncOfflineQueue}
              className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px]"
            >
              Force Sync
            </button>
          </div>
        )}

        {/* Main Snitch-Style 1-Row Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Zone 1: Snitch / ATAKÉ Wordmark */}
          <div className="flex items-center gap-6">
            <a href="#hero" className="flex items-baseline gap-1.5 group">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase font-display leading-none">
                ATAKÉ
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-mono font-bold">
                SNITCH.CO
              </span>
            </a>

            {/* Quick Icon Links */}
            <nav className="hidden sm:flex items-center gap-2 text-zinc-400">
              <a
                href="#collection"
                className="p-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
                title="Drops"
              >
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
              </a>
              <a
                href="#compare"
                className="p-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
                title="1v1 Compare"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
              </a>
              <a
                href="#lookbook"
                className="p-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
                title="Lookbook"
              >
                <Camera className="w-4 h-4 text-zinc-300" />
              </a>
              {(user.role === 'manager' || user.role === 'superadmin' || user.role === 'stylist') && (
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="p-2 rounded-lg text-amber-400 hover:bg-white/5 transition-colors"
                  title="Admin"
                >
                  <ShieldCheck className="w-4 h-4" />
                </button>
              )}
            </nav>
          </div>

          {/* Zone 2: Search, Wishlist, Currency, Language & Bag */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Search Catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Currency Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/5"
              >
                <span>{currency.code}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>
              {isCurrencyMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-32 py-1 bg-[#15171c] border border-white/10 rounded shadow-2xl z-50 font-mono text-xs"
                  onMouseLeave={() => setIsCurrencyMenuOpen(false)}
                >
                  {Object.values(CURRENCIES).map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrencyCode(curr.code);
                        setIsCurrencyMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center justify-between text-zinc-300"
                    >
                      <span>{curr.code}</span>
                      <span>{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono uppercase text-zinc-300 hover:text-white hover:bg-white/5"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>{languageLabels[language]}</span>
              </button>
              {isLangMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-28 py-1 bg-[#15171c] border border-white/10 rounded shadow-2xl z-50 text-xs font-mono"
                  onMouseLeave={() => setIsLangMenuOpen(false)}
                >
                  {(['en', 'fr', 'it', 'es', 'ja'] as SupportedLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-zinc-300 capitalize"
                    >
                      {languageLabels[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              )}
            </button>

            {/* Wishlist Link with counter */}
            <a
              href="#collection"
              className="relative p-2 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:inline-block"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 px-1 py-0.2 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold">
                  {wishlist.length}
                </span>
              )}
            </a>

            {/* Account / RBAC trigger */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="p-2 rounded text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              title={`Account: ${user.name}`}
            >
              <UserIcon className="w-4 h-4 text-[#d4af37]" />
            </button>

            {/* Snitch-Style Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-all text-xs font-mono font-bold shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Snitch-Style Instant Search Modal with Live Results */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#14151a] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-4 h-4 text-[#d4af37]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search dresses, silhouettes, pure silk, velvet..."
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  className="w-full bg-transparent text-white font-mono text-sm outline-none placeholder-zinc-500"
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchWord('');
                }}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Keyword Suggestions */}
            {!searchWord && (
              <div className="space-y-2 text-xs font-mono">
                <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Trending Searches:</p>
                <div className="flex flex-wrap gap-2">
                  {['L’Éclipse Gown', 'Bias Cut Silk', 'Crimson Velvet', 'Architectural Column', 'Plissé Halter'].map(
                    (kw) => (
                      <button
                        key={kw}
                        onClick={() => setSearchWord(kw)}
                        className="px-2.5 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-[#d4af37]"
                      >
                        {kw}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Results Grid */}
            {searchResults.length > 0 && (
              <div className="max-h-72 overflow-y-auto space-y-2 pt-2">
                {searchResults.map((dress) => (
                  <div
                    key={dress.id}
                    onClick={() => {
                      setSelectedGalleryDress(dress);
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-[#d4af37]/40 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white font-display uppercase">{dress.name}</h4>
                      <p className="text-xs text-zinc-400 font-mono">
                        {dress.silhouette} &middot; {dress.colors.length} shades
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#d4af37]">
                      ${dress.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
