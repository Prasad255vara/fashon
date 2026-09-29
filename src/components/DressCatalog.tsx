import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { DressCard } from './DressCard';
import { LUXURY_BRANDS } from '../data/dresses';
import { Search, LayoutGrid, Grid3X3, Grid2X2 } from 'lucide-react';

export const DressCatalog: React.FC = () => {
  const { dresses, gridViewMode, setGridViewMode } = useStore();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'weight-desc'>('featured');

  const filterTabs = [
    { id: 'all', label: 'All Silhouettes' },
    { id: 'bestseller', label: 'Bestsellers', tag: 'BESTSELLER' },
    { id: 'hot', label: 'Hot Drops', tag: 'HOT DROP' },
    { id: 'column', label: 'Column', match: 'Architectural Column' },
    { id: 'silk', label: 'Silk Slip', match: 'Fluid Bias Cut' },
    { id: 'velvet', label: 'Ballgown', match: 'Corseted Ballgown' },
  ];

  const filteredDresses = useMemo(() => {
    return dresses
      .filter((dress) => {
        if (selectedBrand && dress.brand !== selectedBrand) return false;
        if (activeFilter !== 'all') {
          const tab = filterTabs.find((f) => f.id === activeFilter);
          if (tab?.tag && dress.tag !== tab.tag) return false;
          if (tab?.match && dress.silhouette !== tab.match) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchBrand = dress.brand.toLowerCase().includes(q);
          const matchName = dress.name.toLowerCase().includes(q);
          const matchFabric = dress.fabric.toLowerCase().includes(q);
          const matchSilhouette = dress.silhouette.toLowerCase().includes(q);
          const matchColor = dress.colors.some((c) => c.name.toLowerCase().includes(q));
          if (!matchBrand && !matchName && !matchFabric && !matchSilhouette && !matchColor) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'weight-desc') return b.drapeWeightGsm - a.drapeWeightGsm;
        return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      });
  }, [dresses, selectedBrand, activeFilter, searchQuery, sortBy]);

  // Determine grid columns based on gridViewMode
  const gridClasses =
    gridViewMode === 'compact'
      ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'
      : gridViewMode === 'split'
      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8';

  return (
    <section id="collection" className="py-12 bg-[#0c0d0f] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-display tracking-tight">
              COLLECTION
            </h2>
            {selectedBrand && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fcf6ba] text-xs font-mono font-bold tracking-wider">
                {selectedBrand}
              </span>
            )}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search house, gown..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:border-[#d4af37] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Brand Houses Quick Filter Row */}
        <div className="py-3 overflow-x-auto scrollbar-none border-b border-white/5">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setSelectedBrand(null)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                !selectedBrand
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              ALL HOUSES
            </button>
            {LUXURY_BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                className={`px-3 py-1 rounded-lg text-xs font-display tracking-wider uppercase font-bold transition-all ${
                  selectedBrand === brand
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Segmented Controls & Grid Density Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-white/[0.06]">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg whitespace-nowrap transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-white/20 text-white font-bold border border-white/30'
                    : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Sort & Grid Density Switcher */}
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            {/* Grid Density View Switcher */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-white/10">
              <button
                onClick={() => setGridViewMode('comfortable')}
                className={`p-1.5 rounded transition-colors ${
                  gridViewMode === 'comfortable' ? 'bg-white/20 text-white' : 'text-zinc-500 hover:text-white'
                }`}
                title="3-Grid Comfortable"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridViewMode('compact')}
                className={`p-1.5 rounded transition-colors ${
                  gridViewMode === 'compact' ? 'bg-white/20 text-white' : 'text-zinc-500 hover:text-white'
                }`}
                title="4-Grid Compact"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridViewMode('split')}
                className={`p-1.5 rounded transition-colors ${
                  gridViewMode === 'split' ? 'bg-white/20 text-white' : 'text-zinc-500 hover:text-white'
                }`}
                title="2-Grid Split"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-zinc-900 border border-white/10 text-zinc-300 py-1.5 px-3 rounded-lg text-xs outline-none cursor-pointer focus:border-[#d4af37]"
              >
                <option value="featured">Featured Drops</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="weight-desc">Drape Density (GSM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Dress Grid */}
        <div className={`mt-8 ${gridClasses}`}>
          {filteredDresses.map((dress) => (
            <DressCard key={dress.id} dress={dress} />
          ))}
        </div>

        {filteredDresses.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <p className="text-zinc-400 font-mono text-sm">No couture dresses match your filter criteria.</p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSelectedBrand(null);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-[#d4af37] text-black font-display text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
