import React, { useEffect, useCallback } from 'react';
import { X, ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { Wallpaper } from '../data/wallpapers';

interface WallpaperModalProps {
  wallpaper: Wallpaper | null;
  allWallpapers: Wallpaper[];
  onClose: () => void;
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  onDownload: (wallpaper: Wallpaper) => void;
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  wallpaper,
  allWallpapers,
  onClose,
  onSelectWallpaper,
  onDownload,
}) => {


  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!wallpaper) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        const idx = allWallpapers.findIndex((w) => w.id === wallpaper.id);
        if (idx !== -1) {
          onSelectWallpaper(allWallpapers[(idx + 1) % allWallpapers.length]);
        }
      } else if (e.key === 'ArrowLeft') {
        const idx = allWallpapers.findIndex((w) => w.id === wallpaper.id);
        if (idx !== -1) {
          onSelectWallpaper(allWallpapers[(idx - 1 + allWallpapers.length) % allWallpapers.length]);
        }
      }
    },
    [wallpaper, allWallpapers, onClose, onSelectWallpaper]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!wallpaper) return null;

  const currentIndex = allWallpapers.findIndex((w) => w.id === wallpaper.id);
  const total = allWallpapers.length;

  const handleNext = () => {
    if (currentIndex !== -1) {
      onSelectWallpaper(allWallpapers[(currentIndex + 1) % total]);
    }
  };

  const handlePrev = () => {
    if (currentIndex !== -1) {
      onSelectWallpaper(allWallpapers[(currentIndex - 1 + total) % total]);
    }
  };



  // Touch Swipe for mobile devices
  const touchStartXRef = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handlePrev();
      else handleNext();
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={wallpaper.title}
      className="modal-backdrop"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        className="modal-close cursor-pointer"
        onClick={onClose}
        aria-label="Close modal"
      >
        <X size={20} />
      </button>

      {/* Prev / Next navigation arrows */}
      <button
        className="modal-nav modal-nav-left cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        aria-label="Previous wallpaper"
      >
        <ArrowLeft size={20} />
      </button>

      <button
        className="modal-nav modal-nav-right cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        aria-label="Next wallpaper"
      >
        <ArrowRight size={20} />
      </button>

      {/* Artwork presentation */}
      <div className="modal-art" onClick={(e) => e.stopPropagation()}>
        <img
          key={wallpaper.id}
          src={wallpaper.src}
          alt={wallpaper.title}

        />
      </div>

      {/* Details and Actions */}
      <div className="modal-info" onClick={(e) => e.stopPropagation()}>
        <span className="eyebrow">{wallpaper.displayCategory}</span>
        <h2>{wallpaper.title}</h2>
        <p className="font-mono text-xs text-neutral-400 mb-6">1920 x 1080</p>

        <div className="modal-actions">
          <button
            onClick={() => onDownload(wallpaper)}
            className="cursor-pointer"
            title="Download wallpaper"
          >
            <Download size={14} /> Download
          </button>
        </div>
      </div>
    </div>
  );
};
