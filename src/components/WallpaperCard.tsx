import React, { useState, useEffect } from 'react';
import { Maximize2, AlertCircle } from 'lucide-react';
import { Wallpaper } from '../data/wallpapers';
import { getWallpaperUrl } from '../utils/url';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onOpenModal: (wallpaper: Wallpaper) => void;
  onDownload?: (wallpaper: Wallpaper) => void;
  index?: number;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({
  wallpaper,
  onOpenModal,
  index = 1,
}) => {
  const resolvedSrc = getWallpaperUrl(wallpaper.src);
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const nextSrc = getWallpaperUrl(wallpaper.src);
    setCurrentSrc(nextSrc);
    setHasError(false);
    setLoaded(false);
  }, [wallpaper.src]);

  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <article className="wallpaper-card">
      <button
        type="button"
        className="card-image-button cursor-pointer aspect-video relative w-full overflow-hidden block"
        onClick={() => onOpenModal(wallpaper)}
        aria-label={`Preview wallpaper`}
      >
        <span className="card-index">{String(index).padStart(2, '0')}</span>
        <span className="card-open" title="Click to preview wallpaper">
          <Maximize2 size={14} />
        </span>

        {/* Skeleton shimmer shown while loading */}
        {!loaded && !hasError && <div className="card-skeleton" />}

        {!hasError ? (
          <img
            src={currentSrc}
            alt={wallpaper.title}
            onError={handleImageError}
            onLoad={() => setLoaded(true)}
            loading="lazy"
            decoding="async"
            fetchPriority={index <= 8 ? 'high' : 'low'}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#121214] text-neutral-500 text-center">
            <AlertCircle size={22} className="text-neutral-600 mb-1.5" />
            <span className="font-mono text-[10px] tracking-wider text-neutral-400">
              1920 x 1080
            </span>
          </div>
        )}
      </button>

    </article>
  );
};
