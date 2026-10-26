import React from 'react';
import { 
  Sparkles, 
  Coffee, 
  CupSoda, 
  GlassWater, 
  Citrus, 
  Flame, 
  Cake 
} from 'lucide-react';
import { CATEGORIES } from '../data/menuData';

const iconMap = {
  Sparkles: Sparkles,
  Coffee: Coffee,
  CupSoda: CupSoda,
  GlassWater: GlassWater,
  Citrus: Citrus,
  Flame: Flame,
  Cake: Cake
};

export default function CategoryNav({ activeCategory, setActiveCategory, lang }) {
  const isAr = lang === 'ar';
  const isDual = lang === 'dual';

  return (
    <nav className="category-nav-wrapper">
      <div className="category-nav-scroll">
        {CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Sparkles;
          const isActive = activeCategory === cat.id;

          let label = isAr ? cat.nameAr : cat.nameEn;
          if (isDual && cat.id !== 'all') {
            label = `${cat.nameAr} • ${cat.nameEn}`;
          }

          return (
            <button
              key={cat.id}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="category-icon-box">
                <IconComponent size={18} />
              </span>
              <span className="category-name">{label}</span>
              <span className="category-count-badge">{cat.count}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
