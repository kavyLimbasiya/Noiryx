import React from 'react';
import { Search, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  lovedCount: number;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  lovedCount,
  onNavigateSection,
}) => {
  return (
    <header className="site-header" data-testid="site-header">
      {/* Brand Wordmark */}
      <a
        className="brand"
        href="#hero-preview"
        onClick={(e) => {
          e.preventDefault();
          onNavigateSection('hero-preview');
        }}
        data-testid="brand-link"
      >
        <span>NOIRYX</span>
        <small>/ DIGITAL VISUALS</small>
      </a>

      {/* Main Navigation: 1 for Normal and 1 for Live */}
      <nav className="main-nav">
        <button
          type="button"
          onClick={() => onNavigateSection('normal')}
          className="cursor-pointer hover:text-white transition-colors"
        >
          Normal Wallpapers
        </button>
        <button
          type="button"
          onClick={() => onNavigateSection('live')}
          className="cursor-pointer hover:text-purple-300 transition-colors"
        >
          Live Wallpapers
        </button>
        <button
          type="button"
          onClick={() => onNavigateSection('loved')}
          className="cursor-pointer flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <span>Loved</span>
          {lovedCount > 0 && (
            <span className="text-[11px] font-mono-numbers text-purple-400">
              ({lovedCount})
            </span>
          )}
        </button>
      </nav>

      {/* Search Input without Sign In option */}
      <div className="header-actions">
        <div className="search-box">
          <Search size={14} />
          <input
            type="search"
            placeholder="Search setups, themes, anime..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search wallpapers"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5 cursor-pointer"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
