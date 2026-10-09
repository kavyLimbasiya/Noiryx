import React from 'react';
import { CategoryId } from '../data/wallpapers';

interface CategoryMarqueeProps {
  onSelectCategory?: (category: CategoryId) => void;
}

export const CategoryMarquee: React.FC<CategoryMarqueeProps> = () => {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[0, 1, 2].map((copy) => (
          <span key={copy}>
            Normal <b>•</b> Gaming <b>•</b> Anime <b>•</b> Minimal <b>•</b> Nature <b>•</b> Vehicle <b>•</b> Space <b>•</b> Sports <b>•</b> Dark <b>•</b> Paint <b>•</b>{' '}
          </span>
        ))}
      </div>
    </div>
  );
};
