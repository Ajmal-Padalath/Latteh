import React from 'react';
import { MENU_ITEMS } from '../data/menuData';
import { Sparkles, Coffee, CupSoda, GlassWater, Citrus, Flame, Cake } from 'lucide-react';

export default function OriginalBoardView({
  onSelectItem,
  lang
}) {
  const isAr = lang === 'ar';

  // Group items by category precisely as organized on the board
  const coldDrinks = MENU_ITEMS.filter(i => i.categoryId === 'cold_drinks');
  const hotCoffee = MENU_ITEMS.filter(i => i.categoryId === 'hot_coffee');
  const freshJuices = MENU_ITEMS.filter(i => i.categoryId === 'fresh_juices');
  const teaItems = MENU_ITEMS.filter(i => i.categoryId === 'tea');
  const desserts = MENU_ITEMS.filter(i => i.categoryId === 'desserts');
  const coldCoffee = MENU_ITEMS.filter(i => i.categoryId === 'cold_coffee');

  const renderSection = (titleEn, titleAr, items, iconType, heroImg) => (
    <div className="board-section-card">
      {/* Header bar matching the physical menu */}
      <div className="board-section-header">
        <div className="board-header-content">
          <span className="board-title-en">{titleEn}</span>
          <span className="board-title-ar">{titleAr}</span>
        </div>
      </div>

      {/* Board Item List */}
      <div className="board-items-container">
        {/* Floating illustrative image like on physical board */}
        {heroImg && (
          <div className="board-hero-art">
            <img src={heroImg} alt={titleEn} loading="lazy" />
          </div>
        )}

        <div className="board-table-rows">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="board-row-item"
              onClick={() => onSelectItem(item)}
              title="Click to customize and order"
            >
              <div className="board-row-price">{item.price}</div>
              <div className="board-row-name-en">{item.nameEn}</div>
              <div className="board-row-name-ar">{item.nameAr}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="original-board-wrapper">
      {/* Board Heading Header */}
      <div className="board-intro-banner">
        <div className="board-badge">
          <Sparkles size={14} className="text-gold" />
          <span>{isAr ? "عرض لوحة المنيو الأصلية لمقهى لاتيه ليستر" : "Latteh Leicester - Original Board Replica"}</span>
        </div>
        <p className="board-instruction-text">
          {isAr 
            ? "انقر على أي صنف من اللوحة لتخصيص السكر، الحليب، الإضافات، وإضافته فوراً لسلتك" 
            : "Click on any item directly on the board to customize sweetness, milk, extras and add to cart"}
        </p>
      </div>

      {/* 2-Column Exact Layout from the Photo */}
      <div className="board-grid-columns">
        {/* LEFT COLUMN: Cold Drinks, Fresh Juices, Desserts */}
        <div className="board-column">
          {renderSection(
            "Cold Drinks", 
            "مشروبات باردة", 
            coldDrinks, 
            "cold_drinks", 
            "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80"
          )}

          {renderSection(
            "Fresh Juices", 
            "عصائر فريش", 
            freshJuices, 
            "fresh_juices", 
            "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&auto=format&fit=crop&q=80"
          )}

          {renderSection(
            "Desserts", 
            "الحلويات", 
            desserts, 
            "desserts", 
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80"
          )}
        </div>

        {/* RIGHT COLUMN: Hot Coffee, Tea, Cold Coffee */}
        <div className="board-column">
          {renderSection(
            "Hot Coffee", 
            "قهوة ساخنة", 
            hotCoffee, 
            "hot_coffee", 
            "https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&auto=format&fit=crop&q=80"
          )}

          {renderSection(
            "Tea", 
            "شاي", 
            teaItems, 
            "tea", 
            "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=80"
          )}

          {renderSection(
            "Cold Coffee", 
            "قهوة باردة", 
            coldCoffee, 
            "cold_coffee", 
            "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&auto=format&fit=crop&q=80"
          )}
        </div>
      </div>
    </div>
  );
}
