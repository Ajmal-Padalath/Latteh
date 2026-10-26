import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, X, Printer, Store, User, Clock } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function OrderSuccessModal({
  order,
  onClose,
  lang
}) {
  if (!order) return null;

  const isAr = lang === 'ar';

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0e3b2e', '#c99635', '#dfb256', '#ffffff']
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content receipt-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="receipt-header">
          <div className="receipt-success-icon-wrap">
            <CheckCircle size={44} className="text-success" />
          </div>
          <h3 className="receipt-title-ar">{isAr ? "تم تسجيل طلبك بنجاح!" : "Order Placed Successfully!"}</h3>
          <p className="receipt-order-id">
            <span>{isAr ? "رقم استلام الطلب:" : "Order Pick-up #:"}</span> <strong>{order.orderId}</strong>
          </p>
        </div>

        {/* Paper Receipt Simulation */}
        <div className="paper-receipt">
          <div className="paper-receipt-top">
            <h4 className="receipt-brand">{RESTAURANT_INFO.nameAr} - Latteh Cafe</h4>
            <div className="receipt-meta-row">
              <span><Store size={12} /> {isAr ? "استلام من الكاونتر" : "Counter Pick-up"}</span>
              <span><Clock size={12} /> {order.timestamp}</span>
            </div>
            {order.customerName && (
              <div className="receipt-customer-name">
                <User size={12} /> <span>{isAr ? "العميل:" : "Customer:"} {order.customerName}</span>
              </div>
            )}
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-items-list">
            {order.items.map((item, idx) => (
              <div key={idx} className="receipt-item-row">
                <div className="receipt-item-name">
                  <span>{item.quantity}x {isAr ? item.nameAr : item.nameEn}</span>
                  {item.specialNotes && (
                    <small className="receipt-subnote">({item.specialNotes})</small>
                  )}
                </div>
                <div className="receipt-item-price">{item.totalPrice} ر.س</div>
              </div>
            ))}
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-totals-block">
            <div className="receipt-calc-line">
              <span>{isAr ? "شامل ضريبة 15%:" : "VAT 15% Included:"}</span>
              <span>{order.vatAmount} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}</span>
            </div>
            <div className="receipt-calc-line total-grand">
              <span>{isAr ? "الإجمالي المدفوع:" : "Total Amount:"}</span>
              <span>{order.total} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}</span>
            </div>
          </div>

          {/* QR Verification for Barista Screen */}
          <div className="receipt-qr-center">
            <QRCodeSVG 
              value={`ORDER:${order.orderId}|NAME:${order.customerName}|TOTAL:${order.total}`}
              size={110}
              fgColor="#0e3b2e"
            />
            <span className="qr-receipt-hint">
              {isAr ? "أظهر رقم الطلب أو الرمز للكاشير عند الاستلام" : "Show this order number to the barista upon pick-up"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="receipt-actions-row">
          <button className="receipt-print-btn" onClick={handlePrint}>
            <Printer size={16} />
            <span>{isAr ? "طباعة الفاتورة" : "Print Receipt"}</span>
          </button>
          <button className="receipt-done-btn" onClick={onClose}>
            <span>{isAr ? "العودة للقائمة" : "Back to Menu"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
