/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { AnnouncementTicker } from './components/AnnouncementTicker';
import { Navbar } from './components/Navbar';
import { StoryHighlights } from './components/StoryHighlights';
import { BrandMarquee } from './components/BrandMarquee';
import { Hero } from './components/Hero';
import { TrendingCarousel } from './components/TrendingCarousel';
import { SideBySideCompare } from './components/SideBySideCompare';
import { DressCatalog } from './components/DressCatalog';
import { RunwayLookbook } from './components/RunwayLookbook';
import { CustomerReviews } from './components/CustomerReviews';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DressGalleryModal } from './components/DressGalleryModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationCenter } from './components/NotificationCenter';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#0c0d0f] text-zinc-100 selection:bg-[#d4af37] selection:text-black pb-16 md:pb-0">
        {/* Navigation Bar with Search and Wishlist */}
        <Navbar />

        {/* Circular Category Story Highlights Reel */}
        <StoryHighlights />

        {/* Iconic Luxury Fashion Houses Marquee Bar */}
        <BrandMarquee />

        {/* Main Content Feed */}
        <main>
          {/* Snitch Campaign Hero */}
          <Hero />

          {/* Horizontal Swipeable Runway Drops */}
          <TrendingCarousel />

          {/* Flagship: Snitch-Style Side-by-Side Dual Dress Comparison */}
          <SideBySideCompare />

          {/* Catalog with Snitch Grid Density Switcher (4-Col / 3-Col / 2-Col) */}
          <DressCatalog />

          {/* Full-Bleed Paris Runway Editorial Lookbook Gallery */}
          <RunwayLookbook />

          {/* Integrated Verified Customer Reviews */}
          <CustomerReviews />
        </main>

        {/* Footer */}
        <Footer />

        {/* Snitch App-Style Fixed Mobile Bottom Navigation Bar */}
        <MobileBottomNav />

        {/* Global Modals & Drawers */}
        <DressGalleryModal />
        <CartDrawer />
        <CheckoutModal />
        <AuthModal />
        <AdminDashboard />
        <NotificationCenter />
      </div>
    </StoreProvider>
  );
}
