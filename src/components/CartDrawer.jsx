import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, CheckCircle2, ShoppingBag, Store, User } from 'lucide-react';
import { CUSTOMIZATION_OPTIONS, RESTAURANT_INFO } from '../data/menuData';
import { formatPrice } from '../utils/formatPrice';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
  lang
}) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const [customerName, setCustomerName] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const vatAmount = (subtotal * 0.15) / 1.15; // 15% VAT included in price
  const total = subtotal;

  // Format WhatsApp Message for Counter Pickup
  const handleWhatsAppOrder = () => {
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const orderSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const orderVat = orderSubtotal * 0.15;
    const orderTotal = orderSubtotal + orderVat;
    const money = (amount) => `${Number(amount).toFixed(2)} SAR`;
    const optionLabel = (options, id) => options.find((option) => option.id === id);
    const lines = [
      `*☕ LATTEH LEICESTER*`,
      `🛍️ *طلب جديد | NEW ORDER*`,
      '',
      '━━━━━━━━━━━━━━━━━━',
      '',
      '📋 *معلومات الطلب | ORDER INFORMATION*',
      '',
      `🔢 رقم الطلب | Order Number: #${orderNumber}`,
      '',
      '📦 نوع الطلب | ORDER TYPE',
      '',
      'استلام من الكاونتر | TAKEAWAY',
      ...(customerName.trim() ? ['', `👤 اسم العميل | Customer Name: ${customerName.trim()}`] : []),
      '',
      '━━━━━━━━━━━━━━━━━━',
      '',
      '🛒 *تفاصيل الطلب | ORDER DETAILS*',
      ''
    ];

    cart.forEach((item, index) => {
      lines.push(`${item.nameAr} | ${item.nameEn}`);
      if (item.selectedSize) {
        lines.push(`الحجم | Size: ${item.sizeLabelAr || (item.selectedSize === 'large' ? 'كبير' : 'صغير')} - ${item.sizeLabelEn || (item.selectedSize === 'large' ? 'Large' : 'Small')}`);
      }
      const sugar = optionLabel(CUSTOMIZATION_OPTIONS.sugar, item.selectedSugar);
      const milk = optionLabel(CUSTOMIZATION_OPTIONS.milk, item.selectedMilk);
      const ice = optionLabel(CUSTOMIZATION_OPTIONS.ice, item.selectedIce);
      if (sugar) lines.push(`السكر | Sugar: ${sugar.nameAr} - ${sugar.nameEn}`);
      if (milk && item.selectedMilk !== 'full') lines.push(`الحليب | Milk: ${milk.nameAr} - ${milk.nameEn}`);
      if (ice) lines.push(`الثلج | Ice: ${ice.nameAr} - ${ice.nameEn}`);
      if (item.selectedAddOns?.length) {
        lines.push('الإضافات | Extras:');
        item.selectedAddOns.forEach((addon) => lines.push(`• ${addon.nameAr} - ${addon.nameEn}`));
      }
      if (item.specialNotes) lines.push(`ملاحظات | Notes: ${item.specialNotes}`);
      lines.push(
        '',
        `🔢 الكمية | Quantity: ${item.quantity}`,
        `💰 السعر | Unit Price: ${money(item.unitPrice)}`,
        `💵 الإجمالي | Item Total: ${money(item.unitPrice * item.quantity)}`
      );
      if (index < cart.length - 1) lines.push('', '━━━━━━━━━━━━━━━━━━', '');
    });

    lines.push(
      '',
      '━━━━━━━━━━━━━━━━━━',
      '',
      '💰 *ملخص الفاتورة | BILL SUMMARY*',
      '',
      `المجموع الفرعي | Subtotal: ${money(orderSubtotal)}`,
      `ضريبة القيمة المضافة 15% | VAT 15%: ${money(orderVat)}`,
      '',
      '━━━━━━━━━━━━━━━━━━',
      '',
      '💵 *الإجمالي النهائي | GRAND TOTAL*',
      '',
      money(orderTotal),
      '',
      '━━━━━━━━━━━━━━━━━━',
      '',
      '❤️ *شكراً لاختياركم LATTEH LEICESTER*',
      '',
      'شكراً لزيارتكم، نتمنى لكم يوماً سعيداً!',
      '',
      'Thank you for choosing LATTEH LEICESTER! ❤️'
    );
    const message = lines.join('\n');
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${encoded}`, '_blank');
  };

  const handleDigitalSubmit = () => {
    onOrderSuccess({
      orderId: `LAT-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      total,
      vatAmount: vatAmount.toFixed(2),
      customerName: customerName.trim() || (isAr ? "عميل الكاونتر" : "Counter Customer"),
      orderType: isAr ? "استلام من الكاونتر" : "Counter Pick-up",
      timestamp: new Date().toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    });
    onClearCart();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cart-drawer-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} className="text-gold" />
            <h2>{isAr ? "سلة الطلبات" : "Your Order"}</h2>
            <span className="cart-badge-count">{cart.reduce((c, i) => c + i.quantity, 0)}</span>
          </div>

          <button className="modal-close-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Counter Pick-up Notice Banner */}
        <div className="cart-table-banner">
          <div className="banner-left">
            <Store size={18} className="text-gold" />
            <div>
              <div className="banner-table-title">
                {isAr ? "طلب استلام من الكاونتر" : "Counter Pick-up Order"}
              </div>
              <div className="banner-table-subtitle">
                {isAr ? "سيتم تجهيز طلبك للاستلام مباشرة من الفرع" : "Your order will be prepared for pick-up at the counter"}
              </div>
            </div>
          </div>
        </div>

        {/* Optional Customer Name Input */}
        {/* {cart.length > 0 && (
          <div className="customer-name-bar">
            <User size={15} className="text-muted" />
            <div className="customer-name-field">
              <label htmlFor="customer-name-input">
                {isAr ? "اسم العميل (اختياري)" : "Customer name (optional)"}
              </label>
              <input
                id="customer-name-input"
                type="text"
                placeholder={isAr ? "أدخل اسمك للنداء عند الاستلام" : "Enter a name for pick-up"}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="customer-name-input"
              />
            </div>
          </div>
        )} */}

        {/* Cart Items List */}
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <ShoppingBag size={52} className="empty-cart-icon text-muted" />
              <h3>{isAr ? "سلتك فارغة حالياً" : "Your order is empty"}</h3>
              <p>{isAr ? "اختر ما يعجبك من القهوة والمشروبات المنعشة والحلويات" : "Explore our artisan menu and add items to your order"}</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.cartId} className="cart-item-card">
                  <img src={item.image} alt={item.nameEn} className="cart-item-thumb" />
                  
                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <div>
                        <h4 className="cart-item-name-ar">
                          {item.nameAr}
                          {item.selectedSize && (
                            <span className="cart-size-pill">
                              ({item.sizeLabelAr || (item.selectedSize === 'large' ? 'كبير' : 'صغير')})
                            </span>
                          )}
                        </h4>
                        <span className="cart-item-name-en">
                          {item.nameEn}
                          {item.selectedSize && (
                            <span className="cart-size-pill-en">
                              ({item.sizeLabelEn || (item.selectedSize === 'large' ? 'Large' : 'Small')})
                            </span>
                          )}
                        </span>
                      </div>
                      <button 
                        className="delete-item-btn" 
                        onClick={() => onRemoveItem(item.cartId)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Customization Badges */}
                    <div className="cart-item-custom-tags">
                      {item.selectedSize && (
                        <span className="tag-spec tag-size-highlight">
                          {isAr 
                            ? `الحجم: ${item.sizeLabelAr || (item.selectedSize === 'large' ? 'كبير' : 'صغير')}` 
                            : `Size: ${item.sizeLabelEn || (item.selectedSize === 'large' ? 'Large' : 'Small')}`}
                        </span>
                      )}
                      {item.selectedSugar && (
                        <span className="tag-spec">{item.selectedSugar}</span>
                      )}
                      {item.selectedMilk && item.selectedMilk !== 'full' && (
                        <span className="tag-spec">{item.selectedMilk}</span>
                      )}
                      {item.selectedIce && (
                        <span className="tag-spec">{item.selectedIce}</span>
                      )}
                      {item.selectedAddOns?.map((addon) => (
                        <span key={addon.id} className="tag-spec">+{isAr ? addon.nameAr : addon.nameEn}</span>
                      ))}
                    </div>

                    {item.specialNotes && (
                      <p className="cart-item-note">"{item.specialNotes}"</p>
                    )}

                    <div className="cart-item-bottom">
                      <div className="cart-stepper">
                        <button 
                          className="cart-step-btn"
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="cart-step-num">{item.quantity}</span>
                        <button 
                          className="cart-step-btn"
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="cart-item-price">
                        {formatPrice(item.totalPrice, lang)} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Bottom Summary */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="price-summary-box">
              {cart.length > 0 && (
                <div className="customer-name-bar">
                  <User size={15} className="text-muted" />
                  <div className="customer-name-field">
                    <label htmlFor="customer-name-input">
                      {isAr ? "اسم العميل (اختياري)" : "Customer name (optional)"}
                    </label>
                    <input
                      id="customer-name-input"
                      type="text"
                      placeholder={isAr ? "أدخل اسمك للنداء عند الاستلام" : "Enter a name for pick-up"}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="customer-name-input"
                    />
                  </div>
                </div>
              )}
              <div className="summary-line">
                <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                <span>{formatPrice(subtotal.toFixed(2), lang)} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}</span>
              </div>
              <div className="summary-line vat-line">
                <span>{isAr ? "ضريبة القيمة المضافة (15% مشمولة)" : "VAT (15% included)"}</span>
                <span>{formatPrice(vatAmount.toFixed(2), lang)} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}</span>
              </div>
              <div className="summary-line total-line">
                <span>{isAr ? "المجموع الإجمالي" : "Total Amount"}</span>
                <span className="total-gold-price">
                  {formatPrice(total, lang)} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="cart-action-buttons">
              <button className="submit-order-btn" onClick={handleDigitalSubmit}>
                <CheckCircle2 size={18} />
                <span>{isAr ? "تأكيد الطلب واستلام الفاتورة" : "Confirm Order & Get Ticket"}</span>
              </button>

              <button className="whatsapp-order-btn" onClick={handleWhatsAppOrder}>
                <Send size={16} />
                <span>{isAr ? "إرسال الطلب عبر الواتساب" : "Send Order via WhatsApp"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
