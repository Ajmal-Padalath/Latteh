import React from 'react';
import {
  QrCode,
  Moon,
  Sun,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  Store
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function Header({
  lang,
  setLang,
  theme,
  setTheme,
  onOpenQrModal,
  onOpenCart,
  cartCount,
  viewMode,
  setViewMode
}) {
  const isAr = lang === 'ar';
  const isDual = lang === 'dual';

  return (
    <header className="header-container">
      {/* Top Utility Bar */}
      <div className="top-utility-bar">
        <div className="utility-left">
          <span className="info-chip">
            <Clock size={13} className="chip-icon" />
            <span>{isAr ? RESTAURANT_INFO.openingHoursAr : RESTAURANT_INFO.openingHoursEn}</span>
          </span>
          <span className="info-chip desktop-only">
            <MapPin size={13} className="chip-icon" />
            <span>{isAr ? RESTAURANT_INFO.locationAr : RESTAURANT_INFO.locationEn}</span>
          </span>
        </div>

        <div className="utility-actions">
          {/* Store Status Pill */}
          <div className="store-status-pill">
            <span className="store-status-dot"></span>
            <span className="store-status-text">
              {isAr ? "الفرع مفتوح الآن" : "Store Open"}
            </span>
          </div>

          {/* Language Switcher */}
          <div className="lang-toggle-group">
            <button
              className={`lang-btn ${lang === 'ar' ? 'active' : ''}`}
              onClick={() => setLang('ar')}
              title="العربية"
            >
              عربي
            </button>
            <button
              className={`lang-btn ${lang === 'dual' ? 'active' : ''}`}
              onClick={() => setLang('dual')}
              title="عرض باللغتين معا"
            >
              عربي / EN
            </button>
            <button
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            className="icon-circle-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? "وضع النهار" : "الوضع الداكن"}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      {/* Main Hero Branding Section */}
      <div className="hero-banner">
        <div className="hero-background-overlay"></div>
        <div className="hero-content">
          <div className="logo-badge-container animate-float">
            <img
              src="./logo1.PNG"
              alt="Latteh Cafe Logo"
              className="cafe-logo-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="brand-text-block">
            <div className="brand-tagline-badge">
              <Sparkles size={13} className="text-gold" />
              <span>{isAr ? "مقهى ومشروبات وحلويات فاخرة" : "Specialty Coffee & Beverages"}</span>
            </div>

            <h1 className="cafe-title">
              <span className="arabic-name">لاتيه ليستر</span>
              <span className="english-name">Latteh</span>
            </h1>

            <p className="cafe-subtitle">
              {isAr
                ? "امسح رمز الاستجابة السريعة QR لتصفح القائمة الكاملة والطلب مباشرة من هاتفك"
                : "Scan the QR code to explore our full menu and order directly from your phone"}
            </p>

            {/* Quick Action Buttons */}
            <div className="hero-actions-row">
              <button className="primary-action-btn" onClick={onOpenQrModal}>
                <QrCode size={18} />
                <span>{isAr ? "رمز QR الخاص بالمنيو" : "Store Menu QR Code"}</span>
              </button>

              <button
                className={`secondary-action-btn ${viewMode === 'board' ? 'btn-active-gold' : ''}`}
                onClick={() => setViewMode(viewMode === 'board' ? 'cards' : 'board')}
                title={isAr ? "عرض لوحة المنيو الأصلية" : "Original Board View"}
              >
                <Layers size={17} />
                <span>{viewMode === 'board' ? (isAr ? "عرض البطاقات الحديث" : "Modern Cards") : (isAr ? "لوحة المنيو الأصلية" : "Original Board")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
