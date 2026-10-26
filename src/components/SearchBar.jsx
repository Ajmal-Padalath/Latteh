import React from 'react';
import { Search, X, SlidersHorizontal, Flame, Snowflake, Coffee, CakeSlice } from 'lucide-react';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  filterTag,
  setFilterTag,
  totalResults,
  lang
}) {
  const isAr = lang === 'ar';

  const filterOptions = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All', icon: null },
    { id: 'popular', labelAr: '🔥 الأكثر طلباً', labelEn: '🔥 Bestsellers', icon: Flame },
    { id: 'cold', labelAr: '❄️ مثلج ومنعش', labelEn: '❄️ Cold & Iced', icon: Snowflake },
    { id: 'hot', labelAr: '☕ مشروبات ساخنة', labelEn: '☕ Hot Drinks', icon: Coffee },
    { id: 'sweet', labelAr: '🍰 حلى ومخبوزات', labelEn: '🍰 Desserts', icon: CakeSlice }
  ];

  return (
    <div className="search-filter-section">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={isAr ? "ابحث عن مشروب، قهوة، حلى، أو نكهة..." : "Search coffee, mojito, dessert, or ingredients..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="clear-search-btn" 
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Quick Filter Tags */}
      <div className="filter-tags-row">
        {filterOptions.map((opt) => {
          const isActive = filterTag === opt.id;
          return (
            <button
              key={opt.id}
              className={`filter-pill ${isActive ? 'active' : ''}`}
              onClick={() => setFilterTag(opt.id)}
            >
              <span>{isAr ? opt.labelAr : opt.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Result Status */}
      {(searchQuery || filterTag !== 'all') && (
        <div className="search-status-bar">
          <span>
            {isAr 
              ? `تم العثور على ${totalResults} صنف`
              : `Found ${totalResults} items`}
          </span>
          {(searchQuery || filterTag !== 'all') && (
            <button 
              className="reset-filters-link"
              onClick={() => {
                setSearchQuery('');
                setFilterTag('all');
              }}
            >
              {isAr ? "إعادة الضبط" : "Reset Filters"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
