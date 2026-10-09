import React from 'react';
import { CATEGORIES, CategoryId } from '../data/wallpapers';
import categoryPersonAsset from '../assets/images/purple_category_person.png';

interface CategorySectionProps {
  activeCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  categoryCounts: Record<CategoryId, number>;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories" className="category-section" data-testid="category-section">
      <div className="category-background" />

      {/* Futuristic Purple Jacket Persona pointing right */}
      <div className="category-person-wrap">
        <img
          src={categoryPersonAsset}
          alt="Noiryx person pointing at categories"
          className="category-person"
          loading="lazy"
        />
      </div>

      {/* Category Heading Copy */}
      <div className="category-copy">
        <span className="eyebrow">02 / 04 — CATEGORIES</span>
        <h2>Pick your frequency.</h2>
        <p>Filtered discovery across digital universes.</p>
      </div>

      {/* Pill-shaped Category Buttons */}
      <div className="category-controls">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={activeCategory === cat.id ? 'active' : ''}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
};
