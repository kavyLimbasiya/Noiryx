import React, { useState } from 'react';
import { Wallpaper, CategoryId } from '../data/wallpapers';
import { WallpaperCard } from './WallpaperCard';
import { RotateCcw, ChevronDown } from 'lucide-react';

interface EditorialGridProps {
  wallpapers: Wallpaper[];
  activeCategory: CategoryId;
  searchQuery: string;
  onOpenModal: (wallpaper: Wallpaper) => void;
  onDownload: (wallpaper: Wallpaper) => void;
  onResetFilters: () => void;
}

export const EditorialGrid: React.FC<EditorialGridProps> = ({
  wallpapers,
  activeCategory,
  searchQuery,
  onOpenModal,
  onDownload,
  onResetFilters,
}) => {
  const isFiltered = activeCategory !== 'all' || searchQuery.trim().length > 0;
  const [visibleCount, setVisibleCount] = useState(48);

  // Reset pagination when active filter or search query changes
  React.useEffect(() => {
    setVisibleCount(48);
  }, [activeCategory, searchQuery]);

  const displayedWallpapers = wallpapers.slice(0, visibleCount);
  const hasMore = visibleCount < wallpapers.length;

  // Filtered Archive view
  if (isFiltered) {
    return (
      <div className="w-full">
        <div className="filter-status">
          <span className="eyebrow">03 / 04 — THE ARCHIVE</span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-neutral-400">
              Showing {displayedWallpapers.length} of {wallpapers.length} visuals / {activeCategory.toUpperCase()}
            </span>
            <button
              onClick={onResetFilters}
              className="text-xs font-mono text-purple-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <section id="normal" className="collection scroll-mt-28">
          <div className="section-heading">
            <div>
              <h2>{searchQuery ? `SEARCH: "${searchQuery}"` : `${activeCategory.toUpperCase()} COLLECTION`}</h2>
              <p>High-resolution static wallpapers for laptop & desktop</p>
            </div>
            <span className="font-mono text-xs text-neutral-400">
              {wallpapers.length} visuals
            </span>
          </div>

          {wallpapers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5 mt-6">
                {displayedWallpapers.map((wp, idx) => (
                  <WallpaperCard
                    key={wp.id}
                    wallpaper={wp}
                    index={idx + 1}
                    onOpenModal={onOpenModal}
                    onDownload={onDownload}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 48)}
                    className="px-6 py-3 rounded border border-neutral-700 hover:border-purple-500 bg-[#101016] text-neutral-200 hover:text-white font-mono text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>LOAD MORE ({wallpapers.length - visibleCount} REMAINING)</span>
                    <ChevronDown size={14} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state py-16 text-center">
              <p>No wallpapers found matching your selection.</p>
              <span>Try selecting another category or resetting filters.</span>
              <button
                onClick={onResetFilters}
                className="mt-4 inline-block px-5 py-2.5 rounded bg-purple-900/40 border border-purple-500/50 text-xs font-mono text-purple-200 cursor-pointer"
              >
                SHOW ALL VISUALS
              </button>
            </div>
          )}
        </section>
      </div>
    );
  }

  // Section 1: NORMAL WALLPAPERS
  return (
    <div className="w-full">
      {/* Archive Status Bar */}
      <div className="filter-status">
        <span className="eyebrow">03 / 04 — SECTION 1</span>
        <span className="font-mono text-xs text-neutral-400">
          Showing {displayedWallpapers.length} of {wallpapers.length} visuals / ALL
        </span>
      </div>

      {/* SECTION 1: NORMAL WALLPAPERS */}
      <section id="normal" className="collection scroll-mt-28">
        <div className="section-heading">
          <div>
            <h2>NORMAL WALLPAPERS</h2>
            <p>High-resolution static wallpapers for laptop & desktop</p>
          </div>
          <span className="hidden sm:inline font-mono text-xs text-neutral-400">
            {wallpapers.length} visuals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
          {displayedWallpapers.map((wp, idx) => (
            <WallpaperCard
              key={wp.id}
              wallpaper={wp}
              index={idx + 1}
              onOpenModal={onOpenModal}
              onDownload={onDownload}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 48)}
              className="px-6 py-3 rounded border border-neutral-700 hover:border-purple-500 bg-[#101016] text-neutral-200 hover:text-white font-mono text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>LOAD MORE ({wallpapers.length - visibleCount} REMAINING)</span>
              <ChevronDown size={14} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
