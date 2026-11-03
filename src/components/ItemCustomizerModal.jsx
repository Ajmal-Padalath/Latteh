import React, { useState } from 'react';
import { X, Plus, Minus, Check, Coffee, Droplets, Sparkles, MessageSquare } from 'lucide-react';
import { CUSTOMIZATION_OPTIONS, RESTAURANT_INFO } from '../data/menuData';

export default function ItemCustomizerModal({
  item,
  onClose,
  onAddToCart,
  lang
}) {
  const isAr = lang === 'ar';
  const isCold = item.categoryId === 'cold_drinks' || item.categoryId === 'cold_coffee' || item.categoryId === 'fresh_juices';
  const isBeverage = item.categoryId !== 'desserts';
  const hasSizes = item.categoryId === 'hot_coffee' || item.categoryId === 'tea' || (item.priceSmall != null && item.priceLarge != null);

  const [selectedSize, setSelectedSize] = useState(() => {
    if (hasSizes) {
      return 'small';
    }
    return null;
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedSugar, setSelectedSugar] = useState("normal");
  const [selectedMilk, setSelectedMilk] = useState("full");
  const [selectedIce, setSelectedIce] = useState("regular");
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [specialNotes, setSpecialNotes] = useState("");

  if (!item) return null;

  // Pricing based on selected size
  const priceSmall = item.priceSmall != null ? item.priceSmall : item.price;
  const priceLarge = item.priceLarge != null ? item.priceLarge : item.price;
  const caloriesSmall = item.caloriesSmall != null ? item.caloriesSmall : item.calories;
  const caloriesLarge = item.caloriesLarge != null ? item.caloriesLarge : item.calories;

  const currentBasePrice = hasSizes 
    ? (selectedSize === 'large' ? priceLarge : priceSmall)
    : item.price;

  const currentCalories = hasSizes
    ? (selectedSize === 'large' ? caloriesLarge : caloriesSmall)
    : (item.calories || item.caloriesSmall);

  // Toggle add-on
  const toggleAddOn = (addon) => {
    if (selectedAddOns.some(a => a.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  // Calculate total price
  const milkObj = CUSTOMIZATION_OPTIONS.milk.find(m => m.id === selectedMilk);
  const milkExtra = (isBeverage && milkObj) ? milkObj.price : 0;
  const addOnsExtra = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = currentBasePrice + milkExtra + addOnsExtra;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    const sizeLabelAr = hasSizes ? (selectedSize === 'large' ? 'كبير' : 'صغير') : null;
    const sizeLabelEn = hasSizes ? (selectedSize === 'large' ? 'Large' : 'Small') : null;

    const customizedItem = {
      ...item,
      cartId: `${item.id}-${selectedSize || 'standard'}-${Date.now()}`,
      selectedSize: hasSizes ? selectedSize : null,
      sizeLabelAr,
      sizeLabelEn,
      basePrice: currentBasePrice,
      quantity,
      selectedSugar: isBeverage ? selectedSugar : null,
      selectedMilk: isBeverage ? selectedMilk : null,
      selectedIce: isCold ? selectedIce : null,
      selectedAddOns,
      specialNotes,
      unitPrice,
      totalPrice
    };
    onAddToCart(customizedItem);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content customizer-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header with Close Button */}
        <div className="customizer-image-header">
          <img src={item.image} alt={item.nameEn} className="customizer-hero-img" />
          <button className="modal-close-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
          <div className="customizer-header-gradient"></div>
          <div className="customizer-header-title">
            <h2 className="modal-item-title-ar">{item.nameAr}</h2>
            <h3 className="modal-item-title-en">{item.nameEn}</h3>
          </div>
        </div>

        <div className="customizer-body">
          {/* Item Description */}
          <p className="customizer-desc">
            {isAr ? item.descriptionAr : item.descriptionEn}
          </p>

          <div className="customizer-badges-row">
            {currentCalories && (
              <span className="info-chip">
                {currentCalories} {isAr ? "سعرة حرارية" : "calories"}
              </span>
            )}
            <span className="price-chip-highlight">
              {currentBasePrice} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}
            </span>
          </div>

          {/* Size Selection (for hot_coffee and tea) */}
          {hasSizes && (
            <div className="option-section size-selection-section">
              <label className="section-title">
                <Coffee size={15} className="text-gold" />
                <span>{isAr ? "اختر الحجم" : "Select Size"}</span>
              </label>
              <div className="size-options-grid">
                <button
                  type="button"
                  className={`size-card-btn ${selectedSize === 'small' ? 'active' : ''}`}
                  onClick={() => setSelectedSize('small')}
                >
                  <div className="size-card-top">
                    <div className="size-icon-badge size-sm">
                      <Coffee size={16} />
                    </div>
                    <div className="size-label-group">
                      <span className="size-name-main">{isAr ? "صغير" : "Small"}</span>
                      {caloriesSmall && (
                        <span className="size-cal-hint">{caloriesSmall} {isAr ? "سعرة" : "cal"}</span>
                      )}
                    </div>
                  </div>
                  <div className="size-price-tag">
                    {priceSmall} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}
                  </div>
                </button>

                <button
                  type="button"
                  className={`size-card-btn ${selectedSize === 'large' ? 'active' : ''}`}
                  onClick={() => setSelectedSize('large')}
                >
                  <div className="size-card-top">
                    <div className="size-icon-badge size-lg">
                      <Coffee size={21} />
                    </div>
                    <div className="size-label-group">
                      <span className="size-name-main">{isAr ? "كبير" : "Large"}</span>
                      {caloriesLarge && (
                        <span className="size-cal-hint">{caloriesLarge} {isAr ? "سعرة" : "cal"}</span>
                      )}
                    </div>
                  </div>
                  <div className="size-price-tag">
                    {priceLarge} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Beverage Sugar Level Customizer */}
          {isBeverage && (
            <div className="option-section">
              <label className="section-title">
                <Droplets size={15} className="text-gold" />
                <span>{isAr ? "درجة السكر" : "Sugar Level"}</span>
              </label>
              <div className="options-grid">
                {CUSTOMIZATION_OPTIONS.sugar.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`choice-pill ${selectedSugar === opt.id ? 'active' : ''}`}
                    onClick={() => setSelectedSugar(opt.id)}
                  >
                    <span>{isAr ? opt.nameAr : opt.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Milk Options for Coffee/Beverages */}
          {isBeverage && item.categoryId !== 'cold_drinks' && (
            <div className="option-section">
              <label className="section-title">
                <Coffee size={15} className="text-gold" />
                <span>{isAr ? "نوع الحليب" : "Milk Preference"}</span>
              </label>
              <div className="options-grid">
                {CUSTOMIZATION_OPTIONS.milk.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`choice-pill ${selectedMilk === opt.id ? 'active' : ''}`}
                    onClick={() => setSelectedMilk(opt.id)}
                  >
                    <span>{isAr ? opt.nameAr : opt.nameEn}</span>
                    {opt.price > 0 && (
                      <span className="extra-price">+{opt.price} {isAr ? "ر.س" : "SAR"}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ice Level for Cold Drinks */}
          {isCold && (
            <div className="option-section">
              <label className="section-title">
                <Sparkles size={15} className="text-gold" />
                <span>{isAr ? "كمية الثلج" : "Ice Level"}</span>
              </label>
              <div className="options-grid">
                {CUSTOMIZATION_OPTIONS.ice.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`choice-pill ${selectedIce === opt.id ? 'active' : ''}`}
                    onClick={() => setSelectedIce(opt.id)}
                  >
                    <span>{isAr ? opt.nameAr : opt.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional Add-ons */}
          {isBeverage && (
            <div className="option-section">
              <label className="section-title">
                <Plus size={15} className="text-gold" />
                <span>{isAr ? "إضافات اختيارية" : "Optional Add-ons"}</span>
              </label>
              <div className="addons-stack">
                {CUSTOMIZATION_OPTIONS.addOns.map((addon) => {
                  const isChecked = selectedAddOns.some(a => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      className={`addon-row ${isChecked ? 'active' : ''}`}
                      onClick={() => toggleAddOn(addon)}
                    >
                      <div className="addon-left">
                        <span className={`addon-checkbox ${isChecked ? 'checked' : ''}`}>
                          {isChecked && <Check size={12} />}
                        </span>
                        <span className="addon-title">{isAr ? addon.nameAr : addon.nameEn}</span>
                      </div>
                      <span className="addon-price">+{addon.price} {isAr ? "ر.س" : "SAR"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Barista Instructions */}
          <div className="option-section">
            <label className="section-title">
              <MessageSquare size={15} className="text-gold" />
              <span>{isAr ? "ملاحظات خاصة للباريستا" : "Special Instructions"}</span>
            </label>
            <input
              type="text"
              className="notes-input"
              placeholder={isAr ? "مثال: بدون قرفة، كوب ساخن جداً..." : "e.g. extra hot cup, cinnamon on top..."}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="customizer-footer">
          <div className="quantity-stepper">
            <button 
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="qty-number">{quantity}</span>
            <button 
              className="qty-btn"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus size={16} />
            </button>
          </div>

          <button className="confirm-add-cart-btn" onClick={handleConfirm}>
            <span className="confirm-btn-label">
              {isAr ? "إضافة إلى الطلب" : "Add to Order"}
            </span>
            <span className="confirm-btn-price">
              {totalPrice} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
