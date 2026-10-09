import React from 'react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  return (
    <footer className="site-footer">
      <div>
        <a className="brand" href="#hero-preview">
          <span>NOIRYX</span>
          <small>/ DIGITAL VISUALS</small>
        </a>
        <p>Digital wallpapers for people who care about their screen.</p>
      </div>

      <div className="footer-links">
        <button
          onClick={() => onNavigateSection('categories')}
          className="cursor-pointer"
        >
          Categories
        </button>
        <button
          onClick={() => onNavigateSection('recent')}
          className="cursor-pointer"
        >
          Recent
        </button>
        <button
          onClick={() => onNavigateSection('popular')}
          className="cursor-pointer"
        >
          Most Popular
        </button>
        <button
          onClick={() => onNavigateSection('loved')}
          className="cursor-pointer"
        >
          Loved
        </button>
      </div>

      <small>© 2026 NOIRYX. ALL RIGHTS RESERVED.</small>
    </footer>
  );
};
