import React from 'react';
import { Plus, Flame, Sparkles, Check } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function MenuItemCard({
  item,
  lang,
  onSelectItem,
  cartItemCount = 0
}) {
  const isAr = lang === 'ar';
  const isDual = lang === 'dual';
  const hasSizes = item.categoryId === 'hot_coffee' || item.categoryId === 'tea' || (item.priceSmall != null && item.priceLarge != null && item.priceSmall !== item.priceLarge);

  const displayCalories = item.caloriesSmall && item.caloriesLarge && item.caloriesSmall !== item.caloriesLarge
    ? `${item.caloriesSmall}-${item.caloriesLarge}`
    : (item.calories || item.caloriesSmall);

  return (
    <div className="menu-card" onClick={() => onSelectItem(item)}>
      {/* Card Image Area */}
      <div className="card-image-box">
        <img 
          src={item.image} 
          alt={item.nameEn} 
          className="card-img"
          loading="lazy"
          onError={(e) => {
            // Elegant fallback background gradient if image fails
            e.target.src = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80";
          }}
        />
        <div className="card-image-overlay"></div>

        {/* Top Badges */}
        <div className="card-badges-top">
          {item.isSignature && (
            <span className="badge-signature">
              <Sparkles size={11} />
              <span>{isAr ? "مميز" : "Signature"}</span>
            </span>
          )}
          {item.isPopular && !item.isSignature && (
            <span className="badge-popular">
              <Flame size={11} />
              <span>{isAr ? "الأكثر طلباً" : "Popular"}</span>
            </span>
          )}
          {hasSizes && (
            <span className="badge-sizes">
              <span>{isAr ? "صغير / كبير" : "S / L"}</span>
            </span>
          )}
        </div>

        {/* Calorie Tag */}
        {displayCalories && (
          <span className="badge-calories">
            {displayCalories} {isAr ? "سعرة" : "cal"}
          </span>
        )}
      </div>

      {/* Card Content Area */}
      <div className="card-info-box">
        <div className="card-title-row">
          <div className="titles-stack">
            {isDual ? (
              <>
                <h3 className="primary-title">{item.nameAr}</h3>
                <span className="secondary-title">{item.nameEn}</span>
              </>
            ) : isAr ? (
              <>
                <h3 className="primary-title">{item.nameAr}</h3>
                <span className="secondary-title">{item.nameEn}</span>
              </>
            ) : (
              <>
                <h3 className="primary-title">{item.nameEn}</h3>
                <span className="secondary-title">{item.nameAr}</span>
              </>
            )}
          </div>
        </div>

        <p className="card-desc">
          {isAr ? item.descriptionAr : item.descriptionEn}
        </p>

        {/* Bottom Price & Add Action */}
        <div className="card-footer-row">
          <div className="price-tag-container">
            <div className="price-tag">
              <span className="price-amount">
                {hasSizes
                  ? `${item.priceSmall} - ${item.priceLarge}`
                  : item.price}
              </span>
              <span className="price-curr">{isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}</span>
            </div>
            {hasSizes && (
              <span className="price-size-sublabel">
                {isAr ? "حجمين: صغير / كبير" : "2 Sizes: Small / Large"}
              </span>
            )}
          </div>

          <button 
            className={`add-btn ${cartItemCount > 0 ? 'in-cart' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectItem(item);
            }}
            aria-label="Add item"
          >
            {cartItemCount > 0 ? (
              <span className="cart-count-bubble">
                <Check size={13} />
                <span>{cartItemCount}</span>
              </span>
            ) : (
              <>
                <Plus size={16} />
                <span className="add-text">{isAr ? "طلب" : "Add"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
