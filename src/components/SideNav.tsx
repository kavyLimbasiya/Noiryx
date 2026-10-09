import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Layers, Home, Grid, Menu } from 'lucide-react';

interface SideNavProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  searchQuery,
  onSearchChange,
  onNavigateSection,
  onCollapsedChange,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapsedChange?.(next);
  }, [collapsed, onCollapsedChange]);

  const handleMobileNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setMobileOpen(false);
  };

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 800 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = [
    { id: 'hero-preview', label: 'Home', icon: <Home size={17} /> },
    { id: 'categories', label: 'Categories', icon: <Grid size={17} /> },
    { id: 'normal', label: 'Wallpapers', icon: <Layers size={17} /> },
  ];

  return (
    <>
      {/* Mobile Top Header (Visible only on < 800px screens) */}
      <header className="mobile-top-bar" data-testid="mobile-top-bar">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open Navigation Menu"
        >
          <Menu size={22} />
        </button>

        <a
          href="#hero-preview"
          className="mobile-brand"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSection('hero-preview');
          }}
        >
          <span>NOIRYX</span>
          <small>DIGITAL VISUALS</small>
        </a>

        <div className="w-8" />
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Side Navigation Bar (Desktop fixed / Mobile drawer) */}
      <nav
        className={`side-nav${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}
        data-testid="side-nav"
      >
        {/* Brand row with X on right when open, hamburger centered when collapsed */}
        {collapsed ? (
          /* Desktop Collapsed: just the hamburger centered */
          <button
            className="side-nav-toggle"
            onClick={toggleCollapsed}
            aria-label="Open sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="3.5"  width="14" height="2" rx="1" fill="currentColor"/>
              <rect x="2" y="8"    width="14" height="2" rx="1" fill="currentColor"/>
              <rect x="2" y="12.5" width="14" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
        ) : (
          /* Open: brand + X on the right in same row */
          <div className="side-nav-brand-row">
            <a
              className="side-nav-brand"
              href="#hero-preview"
              onClick={(e) => {
                e.preventDefault();
                handleMobileNavClick('hero-preview');
              }}
            >
              <div className="side-nav-brand-text">
                <span>NOIRYX</span>
                <small>DIGITAL VISUALS</small>
              </div>
            </a>
            <button
              className="side-nav-toggle side-nav-toggle-inline"
              onClick={() => {
                if (window.innerWidth < 800) {
                  setMobileOpen(false);
                } else {
                  toggleCollapsed();
                }
              }}
              aria-label="Close sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="side-nav-divider" />

        {/* Search */}
        {(!collapsed || mobileOpen) && (
          <div className="side-nav-search">
            <Search size={13} className="side-nav-search-icon" />
            <input
              type="search"
              placeholder="Search wallpapers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search wallpapers"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="side-nav-search-clear"
                aria-label="Clear search"
              >
                <X size={11} />
              </button>
            )}
          </div>
        )}

        {/* Nav Links */}
        <div className="side-nav-links">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleMobileNavClick(link.id)}
              className="side-nav-link"
              title={collapsed && !mobileOpen ? link.label : undefined}
            >
              <span className="side-nav-link-icon">{link.icon}</span>
              {(!collapsed || mobileOpen) && (
                <span className="side-nav-link-label">
                  {link.label}
                  {link.badge != null && link.badge > 0 && (
                    <span className="side-nav-badge">{link.badge}</span>
                  )}
                </span>
              )}
              {collapsed && !mobileOpen && link.badge != null && link.badge > 0 && (
                <span className="side-nav-badge-dot" />
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        {(!collapsed || mobileOpen) && (
          <div className="side-nav-footer">
            <div className="side-nav-footer-dot" />
            <small>© 2026 NOIRYX</small>
          </div>
        )}
      </nav>
    </>
  );
};

