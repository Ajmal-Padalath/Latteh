import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, CheckCircle2, ShoppingBag, Store, User } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

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
    let message = `☕ *طلب جديد - مقهى لاتيه ليستر*\n`;
    message += `📍 *نوع الطلب:* طلب استلام من الكاونتر (Takeaway)\n`;
    if (customerName.trim()) {
      message += `👤 *اسم العميل:* ${customerName.trim()}\n`;
    }
    message += `------------------------\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.nameAr} (${item.nameEn})* x ${item.quantity} = ${item.totalPrice} ر.س\n`;
      const extras = [];
      if (item.selectedSugar) extras.push(`السكر: ${item.selectedSugar}`);
      if (item.selectedMilk && item.selectedMilk !== 'full') extras.push(`الحليب: ${item.selectedMilk}`);
      if (item.selectedIce) extras.push(`الثلج: ${item.selectedIce}`);
      if (item.selectedAddOns?.length > 0) extras.push(`إضافات: ${item.selectedAddOns.map(a => a.nameAr).join(', ')}`);
      if (item.specialNotes) extras.push(`ملاحظات: ${item.specialNotes}`);
      if (extras.length > 0) {
        message += `   _(${extras.join(' | ')})_\n`;
      }
    });

    message += `------------------------\n`;
    message += `💰 *الإجمالي الكلي:* ${total} ر.س (شامل الضريبة 15%)\n`;
    message += `شكراً لكم! ✨`;

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
        {cart.length > 0 && (
          <div className="customer-name-bar">
            <User size={15} className="text-muted" />
            <input 
              type="text" 
              placeholder={isAr ? "اسم العميل للنداء عند الاستلام (اختياري)..." : "Your name for order pick-up (optional)..."} 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="customer-name-input"
            />
          </div>
        )}

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
                        <h4 className="cart-item-name-ar">{item.nameAr}</h4>
                        <span className="cart-item-name-en">{item.nameEn}</span>
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
                        {item.totalPrice} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}
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
              <div className="summary-line">
                <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                <span>{subtotal.toFixed(2)} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}</span>
              </div>
              <div className="summary-line vat-line">
                <span>{isAr ? "ضريبة القيمة المضافة (15% مشمولة)" : "VAT (15% included)"}</span>
                <span>{vatAmount.toFixed(2)} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}</span>
              </div>
              <div className="summary-line total-line">
                <span>{isAr ? "المجموع الإجمالي" : "Total Amount"}</span>
                <span className="total-gold-price">
                  {total} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}
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
