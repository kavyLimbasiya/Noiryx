import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Wallpaper } from '../data/wallpapers';
import heroAsset from '../assets/images/god_mode_hero.png';

interface HeroLaptopPreviewProps {
  wallpapers: Wallpaper[];
  onOpenModal: (wallpaper: Wallpaper) => void;
  onDownload?: (wallpaper: Wallpaper) => void;
  currentCategory: string;
}

export const HeroLaptopPreview: React.FC<HeroLaptopPreviewProps> = ({
  wallpapers,
  onOpenModal,
  currentCategory,
}) => {
  // Cap at 8 preview items as shown in the screenshot ("01 / 08")
  const previewItems = useMemo(() => {
    return wallpapers.slice(0, 8);
  }, [wallpapers]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [currentCategory]);

  const total = previewItems.length || 1;
  const currentWallpaper = previewItems[currentIndex] || wallpapers[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Touch Swipe for mobile devices
  const touchStartXRef = useRef<number | null>(null);

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



  // Keyboard arrow listeners for wallpaper switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <section
      id="hero-preview"
      className="hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Ambience & Lighting */}
      <div className="hero-grid" />
      <div className="hero-light" />
      <div className="hero-purple-glow" />

      {/* 3D Stage with Person, Background Typography & Integrated Laptop Display */}
      <div className="hero-stage">
        {/* Giant NOIRYX Typography Behind the Character Head */}
        <div className="hero-brand-bg" aria-hidden="true">
          <span className="brand-word-no">NOIR</span><span className="brand-word-yx">YX</span>
        </div>

        {/* The Live Wallpaper Display Inside the Laptop */}
        {currentWallpaper && (
          <div
            className="laptop-screen"
            onClick={() => onOpenModal(currentWallpaper)}
            title="Click to view full screen"
          >
            <img
              key={currentWallpaper.id}
              src={currentWallpaper.src}
              alt={currentWallpaper.title}

              loading="eager"
            />
            <span className="screen-scanline" />
            <div className="laptop-screen-glare" />
          </div>
        )}

        {/* The Cutout Persona Asset (God Mode On balaclava + black hoodie holding laptop) */}
        <img
          src={heroAsset}
          alt="Noiryx God Mode On Hero holding laptop"
          className="hero-person"
          loading="eager"
          fetchPriority="high"
        />

        {/* Left Carousel Arrow Button */}
        <button
          className="carousel-arrow left cursor-pointer"
          onClick={handlePrev}
          aria-label="Previous wallpaper"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Right Carousel Arrow Button */}
        <button
          className="carousel-arrow right cursor-pointer"
          onClick={handleNext}
          aria-label="Next wallpaper"
        >
          <ArrowRight size={20} />
        </button>

        {/* Preview Data Strip in Bottom Right */}
        {currentWallpaper && (
          <div className="preview-data">
            <span>
              {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <strong>{currentWallpaper.displayCategory}</strong>
            <small>1920 × 1080 • {currentWallpaper.title}</small>
          </div>
        )}

        {/* Wallpaper Quick Switcher Dots */}
        <div className="hero-dots-nav">
          {previewItems.map((item, idx) => (
            <button
              key={item.id}
              className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to wallpaper ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
