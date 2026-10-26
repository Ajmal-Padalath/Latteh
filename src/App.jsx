import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import SearchBar from './components/SearchBar';
import MenuItemCard from './components/MenuItemCard';
import ItemCustomizerModal from './components/ItemCustomizerModal';
import CartDrawer from './components/CartDrawer';
import QrCodeModal from './components/QrCodeModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import OriginalBoardView from './components/OriginalBoardView';

import { MENU_ITEMS, CATEGORIES, RESTAURANT_INFO } from './data/menuData';
import { ShoppingBag } from 'lucide-react';
import './App.css';

export default function App() {
  // 1. Language state: 'ar' (Arabic default), 'en' (English), 'dual' (Bilingual)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('latteh_lang') || 'ar';
  });

  // 2. Theme: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('latteh_theme') || 'light';
  });

  // 3. Category & Filters
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'board'

  // 4. Cart & Modals
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('latteh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Synchronize document attributes
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'ar';
    document.documentElement.dir = lang === 'en' ? 'rtl' : 'rtl'; // Arabic & Dual default to RTL
    if (lang === 'en') {
      document.documentElement.dir = 'ltr';
      document.body.setAttribute('dir', 'ltr');
    } else {
      document.body.setAttribute('dir', 'rtl');
    }
    localStorage.setItem('latteh_lang', lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('latteh_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('latteh_cart', JSON.stringify(cart));
  }, [cart]);

  // Show toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Add Item to Cart
  const handleAddToCart = (customizedItem) => {
    setCart((prev) => [...prev, customizedItem]);
    showToast(lang === 'ar' ? `تمت إضافة "${customizedItem.nameAr}" إلى السلة` : `Added "${customizedItem.nameEn}" to order`);
  };

  // Update Item Quantity in Cart
  const handleUpdateQuantity = (cartId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(cartId);
      return;
    }
    setCart((prev) => 
      prev.map((item) => 
        item.cartId === cartId 
          ? { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty }
          : item
      )
    );
  };

  // Remove Item from Cart
  const handleRemoveItem = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Filter Menu Items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // 1. Category match
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
        return false;
      }

      // 2. Search query match (Arabic or English or tags)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchAr = item.nameAr.toLowerCase().includes(query);
        const matchEn = item.nameEn.toLowerCase().includes(query);
        const matchDescAr = item.descriptionAr.toLowerCase().includes(query);
        const matchDescEn = item.descriptionEn.toLowerCase().includes(query);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(query));
        if (!matchAr && !matchEn && !matchDescAr && !matchDescEn && !matchTags) {
          return false;
        }
      }

      // 3. Filter Tag match
      if (filterTag === 'popular' && !item.isPopular) return false;
      if (filterTag === 'cold' && item.categoryId !== 'cold_drinks' && item.categoryId !== 'cold_coffee' && item.categoryId !== 'fresh_juices') return false;
      if (filterTag === 'hot' && item.categoryId !== 'hot_coffee' && item.categoryId !== 'tea') return false;
      if (filterTag === 'sweet' && item.categoryId !== 'desserts') return false;

      return true;
    });
  }, [activeCategory, searchQuery, filterTag]);

  // Total count in cart
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <div className="latteh-app">
      {/* Top Header */}
      <Header
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* View Mode Toggle: Modern Cards vs Original Physical Board */}
      {viewMode === 'board' ? (
        <OriginalBoardView
          lang={lang}
          onSelectItem={(item) => setSelectedItemForModal(item)}
        />
      ) : (
        <>
          {/* Category Horizontal Navigation */}
          <CategoryNav
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            lang={lang}
          />

          {/* Search Bar & Tag Filters */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterTag={filterTag}
            setFilterTag={setFilterTag}
            totalResults={filteredItems.length}
            lang={lang}
          />

          {/* Menu Items Grid */}
          <main className="menu-grid-container">
            {filteredItems.length === 0 ? (
              <div className="empty-cart-state" style={{ gridColumn: '1 / -1' }}>
                <ShoppingBag size={48} className="text-muted" />
                <h3>{lang === 'ar' ? "لم يتم العثور على نتائج" : "No items found"}</h3>
                <p>{lang === 'ar' ? "جرب البحث بكلمات أخرى أو اختر فئة أخرى" : "Try searching for a different keyword or category"}</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const countInCart = cart
                  .filter((ci) => ci.id === item.id)
                  .reduce((c, ci) => c + ci.quantity, 0);

                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    lang={lang}
                    onSelectItem={(it) => setSelectedItemForModal(it)}
                    cartItemCount={countInCart}
                  />
                );
              })
            )}
          </main>
        </>
      )}

      {/* Floating Bottom Cart Bar (Appears when items are in cart) */}
      {totalCartCount > 0 && (
        <div className="floating-bottom-bar animate-fade-in" onClick={() => setIsCartOpen(true)}>
          <div className="floating-bar-left">
            <div className="floating-cart-icon-wrap">
              <ShoppingBag size={20} />
              <span className="floating-cart-badge">{totalCartCount}</span>
            </div>
            <div className="floating-bar-info">
              <span className="floating-table-text">
                {lang === 'ar' ? "سلة الطلب" : "Your Order"} • {totalCartCount} {lang === 'ar' ? "أصناف" : "items"}
              </span>
              <span className="floating-total-price">
                {totalCartPrice} {lang === 'ar' ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}
              </span>
            </div>
          </div>

          <button className="floating-view-cart-btn" onClick={() => setIsCartOpen(true)}>
            {lang === 'ar' ? "عرض الفاتورة" : "View Order"}
          </button>
        </div>
      )}

      {/* Item Customizer Modal */}
      {selectedItemForModal && (
        <ItemCustomizerModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
          onAddToCart={handleAddToCart}
          lang={lang}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderSuccess={(orderData) => setCompletedOrder(orderData)}
        lang={lang}
      />

      {/* Single Store QR Code Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        lang={lang}
      />

      {/* Order Success Receipt Modal */}
      {completedOrder && (
        <OrderSuccessModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
          lang={lang}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-alert">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-content">
          <h3 className="footer-logo-title">{RESTAURANT_INFO.nameAr} - {RESTAURANT_INFO.nameEn}</h3>
          <p className="footer-sub">{lang === 'ar' ? RESTAURANT_INFO.sloganAr : RESTAURANT_INFO.sloganEn}</p>
          <p className="footer-tax-note">{lang === 'ar' ? RESTAURANT_INFO.taxNoteAr : RESTAURANT_INFO.taxNoteEn}</p>
        </div>
      </footer>
    </div>
  );
}
