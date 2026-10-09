import React, { useState } from 'react';
import { Sparkles, Maximize2, Heart, Play } from 'lucide-react';
import { Wallpaper } from '../data/wallpapers';

interface LiveWallpapersSectionProps {
  wallpapers: Wallpaper[];
  onOpenModal: (wallpaper: Wallpaper) => void;
  onToggleLove: (id: string) => void;
  isLoved: (id: string) => boolean;
  onDownload: (wallpaper: Wallpaper) => void;
}

export const LiveWallpapersSection: React.FC<LiveWallpapersSectionProps> = ({
  wallpapers,
  onOpenModal,
  onToggleLove,
  isLoved,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="live" className="collection scroll-mt-28">
      {/* Section Header */}
      <div className="section-heading">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-mono text-[11px] uppercase tracking-widest mb-1.5">
            <Sparkles size={13} />
            <span>DYNAMIC VISUALS</span>
          </div>
          <h2>LIVE WALLPAPERS</h2>
          <p>Interactive animated visuals with dynamic ambient motion</p>
        </div>
        <span className="hidden sm:inline font-mono text-xs text-neutral-400">
          1920 x 1080 ({wallpapers.length} visuals)
        </span>
      </div>

      {/* Grid of Live Wallpapers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
        {wallpapers.map((wp, idx) => {
          const isItemLoved = isLoved(wp.id);
          const isHovered = hoveredId === wp.id;

          return (
            <article
              key={wp.id}
              className="wallpaper-card relative group"
              onMouseEnter={() => setHoveredId(wp.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                type="button"
                className="card-image-button cursor-pointer aspect-video relative w-full overflow-hidden block border border-purple-900/30 hover:border-purple-500 transition-all rounded"
                onClick={() => onOpenModal(wp)}
                aria-label={`Preview live wallpaper`}
              >
                {/* Index tag */}
                <span className="card-index">{String(idx + 1).padStart(2, '0')}</span>

                <span className="card-open" title="Click to preview wallpaper">
                  <Maximize2 size={14} />
                </span>

                {/* Wallpaper Media */}
                <img
                  src={wp.src}
                  alt={wp.title}

                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isHovered ? 'scale-105 filter brightness-110' : 'scale-100'
                  }`}
                />

                {/* Subtle Dynamic Scanline Motion on Hover */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background:
                      'linear-gradient(rgba(147, 51, 234, 0.08) 50%, rgba(0, 0, 0, 0.25) 50%)',
                    backgroundSize: '100% 4px',
                  }}
                />

                {/* Subtle Play Overlay on Hover */}
                <div
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-black/60 border border-purple-500/60 flex items-center justify-center text-purple-300 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <Play size={16} className="fill-current ml-0.5" />
                  </div>
                </div>
              </button>

              {/* Card Meta without title under image */}
              <div className="card-meta">
                <div className="card-meta-details flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
                  <span>{wp.displayCategory}</span>
                  <span>/</span>
                  <span>1920 x 1080</span>
                </div>

                <button
                  type="button"
                  className={`love-button cursor-pointer ${isItemLoved ? 'is-loved' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLove(wp.id);
                  }}
                  aria-label={isItemLoved ? 'Unlike wallpaper' : 'Love wallpaper'}
                  title={isItemLoved ? 'Remove from loved' : 'Add to loved'}
                >
                  <Heart size={16} className={isItemLoved ? 'fill-current' : ''} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
