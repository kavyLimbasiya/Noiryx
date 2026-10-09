import React, { useState, useMemo, useCallback } from 'react';
import { ALL_WALLPAPERS, Wallpaper, CategoryId } from './wallpapers';
import { SideNav } from './components/SideNav';
import { HeroLaptopPreview } from './components/HeroLaptopPreview';
import { CategorySection } from './components/CategorySection';
import { CategoryMarquee } from './components/CategoryMarquee';
import { EditorialGrid } from './components/EditorialGrid';
import { WallpaperModal } from './components/WallpaperModal';
import { Footer } from './components/Footer';
import { downloadWallpaper } from './utils/download';
import { Download } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalWallpaper, setSelectedModalWallpaper] = useState<Wallpaper | null>(null);
  const [activeSection, setActiveSection] = useState('normal');
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string } | null>(null);

  const showToast = (text: string) => {
    setToastMessage({ text });
    setTimeout(() => {
      setToastMessage((current) => (current?.text === text ? null : current));
    }, 2500);
  };

  const handleDownload = useCallback((wallpaper: Wallpaper) => {
    showToast(`Downloading "${wallpaper.title}" in original resolution...`);
    downloadWallpaper(wallpaper.src, wallpaper.title);
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: ALL_WALLPAPERS.length,
      normal: 0,
      gaming: 0,
      anime: 0,
      minimal: 0,
      nature: 0,
      vehicle: 0,
      space: 0,
      sports: 0,
      dark: 0,
      paint: 0,
    };

    ALL_WALLPAPERS.forEach((wp) => {
      wp.category.forEach((cat) => {
        if (cat in counts) {
          counts[cat as CategoryId]++;
        }
      });
    });

    return counts;
  }, []);

  // Filtered wallpapers based on category & search
  const filteredWallpapers = useMemo(() => {
    let list = ALL_WALLPAPERS;

    if (activeCategory !== 'all') {
      list = list.filter((wp) => wp.category.includes(activeCategory));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (wp) =>
          wp.title.toLowerCase().includes(q) ||
          wp.category.some((c) => c.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activeCategory, searchQuery]);

  // Wallpapers for Laptop Showroom preview (filtered or top wallpapers)
  const carouselWallpapers = useMemo(() => {
    if (activeCategory === 'all') {
      return ALL_WALLPAPERS.slice(0, 8);
    }
    const catList = ALL_WALLPAPERS.filter((wp) => wp.category.includes(activeCategory));
    return catList.length > 0 ? catList.slice(0, 8) : ALL_WALLPAPERS.slice(0, 8);
  }, [activeCategory]);

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
  };

  return (
    <>
      {/* Side Navigation */}
      <SideNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
        onCollapsedChange={setNavCollapsed}
      />

    <main className={`noiryx-app${navCollapsed ? ' nav-collapsed' : ''}`}>

      {/* Hero Section — Interactive Live Wallpaper Preview inside Laptop */}
      <HeroLaptopPreview
        wallpapers={carouselWallpapers}
        onOpenModal={setSelectedModalWallpaper}
        onDownload={handleDownload}
        currentCategory={activeCategory}
      />

      {/* Categories Section */}
      <CategorySection
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categoryCounts={categoryCounts}
      />

      {/* Marquee Strip */}
      <CategoryMarquee onSelectCategory={setActiveCategory} />

      {/* Main Content: Normal Wallpapers */}
      <div className="content-wrap">
        <EditorialGrid
          wallpapers={filteredWallpapers}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onOpenModal={setSelectedModalWallpaper}
          onDownload={handleDownload}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Site Footer */}
      <Footer onNavigateSection={handleNavigateSection} />

      {/* Fullscreen Art Detail Modal — Shows Wallpaper Name When Previewing */}
      {selectedModalWallpaper && (
        <WallpaperModal
          wallpaper={selectedModalWallpaper}
          allWallpapers={ALL_WALLPAPERS}
          onClose={() => setSelectedModalWallpaper(null)}
          onSelectWallpaper={setSelectedModalWallpaper}
          onDownload={handleDownload}
        />
      )}

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg bg-[#121218]/95 backdrop-blur-xl border border-purple-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.8)] text-white text-xs font-mono animate-in slide-in-from-bottom-3 duration-200">
          <div className="p-1.5 rounded bg-purple-900/30 text-purple-400">
            <Download size={14} />
          </div>
          <span>{toastMessage.text}</span>
        </div>
      )}
    </main>
    </>
  );
}
