import React from 'react';
import { useStore } from '../context/StoreContext';

export const StoryHighlights: React.FC = () => {
  const { setSelectedGalleryDress, dresses, setIsAuthOpen } = useStore();

  const stories = [
    {
      id: 'compare',
      href: '#compare',
      imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=300&q=80',
      tag: 'VS',
    },
    {
      id: 'new',
      href: '#collection',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
      tag: 'NEW',
    },
    {
      id: 'bestseller',
      href: '#collection',
      imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80',
      tag: 'HOT',
    },
    {
      id: 'gallery',
      action: () => setSelectedGalleryDress(dresses[0]),
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80',
      tag: '360°',
    },
    {
      id: 'silks',
      href: '#collection',
      imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=300&q=80',
      tag: 'SILK',
    },
    {
      id: 'lookbook',
      href: '#lookbook',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80',
      tag: 'FEED',
    },
    {
      id: 'vip',
      action: () => setIsAuthOpen(true),
      imageUrl: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=300&q=80',
      tag: 'VIP',
    },
  ];

  return (
    <div className="bg-[#0e1014] py-3 border-b border-white/[0.06] overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-6 justify-start sm:justify-center min-w-max">
          {stories.map((story) => {
            const content = (
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-[#d4af37] to-rose-400 transition-transform duration-300 hover:scale-110 shadow-xl relative cursor-pointer group">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-black bg-zinc-900">
                  <img
                    src={story.imageUrl}
                    alt="Story"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-115"
                  />
                </div>
                {story.tag && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black text-[9px] font-mono font-black rounded-full uppercase tracking-tighter shadow-md">
                    {story.tag}
                  </span>
                )}
              </div>
            );

            if (story.action) {
              return (
                <button key={story.id} onClick={story.action} type="button">
                  {content}
                </button>
              );
            }

            return (
              <a key={story.id} href={story.href}>
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
