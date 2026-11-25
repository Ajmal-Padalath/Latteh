import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, X, Share2, Download, Store, User, Clock } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { formatPrice } from '../utils/formatPrice';

export default function OrderSuccessModal({
  order,
  onClose,
  lang
}) {
  if (!order) return null;

  const isAr = lang === 'ar';
  const [shareOpen, setShareOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const qrRef = useRef(null);

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0e3b2e', '#c99635', '#dfb256', '#ffffff']
    });
  }, []);

  const getQrPng = async () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) throw new Error('Order QR code is unavailable');
    const svgUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' }));
    try {
      const image = new Image();
      image.src = svgUrl;
      await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 660;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Unable to create QR image');
      context.fillStyle = '#fff';
      context.fillRect(0, 0, 660, 660);
      context.drawImage(image, 20, 20, 620, 620);
      return await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Unable to export QR image')), 'image/png'));
    } finally { URL.revokeObjectURL(svgUrl); }
  };

  const handleDownload = async () => {
    try {
      const url = URL.createObjectURL(await getQrPng());
      const link = document.createElement('a');
      link.href = url;
      link.download = `latteh-order-${order.orderId}-qr.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch { setShareMessage(isAr ? 'تعذر تنزيل رمز QR. حاول مرة أخرى.' : 'Could not download the QR code. Please try again.'); }
  };

  const handleSocialShare = async (service) => {
    setShareOpen(false);
    const shareText = `Latteh Leicester order ${order.orderId} - Show this QR code at pickup.`;
    if (service === 'WhatsApp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
      return;
    }
    try {
      const blob = await getQrPng();
      const file = new File([blob], `latteh-order-${order.orderId}-qr.png`, { type: 'image/png' });
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ title: `Latteh order ${order.orderId}`, text: shareText, files: [file] });
      } else {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setShareMessage(service === 'Instagram'
          ? (isAr ? 'تم نسخ رمز QR. الصقه في Instagram.' : 'QR copied. Paste it into an Instagram message or story.')
          : (isAr ? 'تم نسخ رمز QR. الصقه في ShareChat.' : 'QR copied. Paste it into ShareChat.'));
      }
    } catch { setShareMessage(isAr ? 'المشاركة غير متاحة. حاول تنزيل رمز QR.' : 'Sharing is unavailable here. Try downloading the QR code.'); }
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
            <h4 className="receipt-brand">{RESTAURANT_INFO.nameAr} - Latteh Leicester</h4>
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
                  <span>
                    {item.quantity}x {isAr ? item.nameAr : item.nameEn}
                    {item.selectedSize && (
                      <span className="receipt-item-size-tag">
                        {" "}({isAr ? (item.sizeLabelAr || (item.selectedSize === 'large' ? 'كبير' : 'صغير')) : (item.sizeLabelEn || (item.selectedSize === 'large' ? 'Large' : 'Small'))})
                      </span>
                    )}
                  </span>
                  {item.specialNotes && (
                    <small className="receipt-subnote">({item.specialNotes})</small>
                  )}
                </div>
                <div className="receipt-item-price">{formatPrice(item.totalPrice, lang)} ر.س</div>
              </div>
            ))}
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-totals-block">
            <div className="receipt-calc-line">
              <span>{isAr ? "شامل ضريبة 15%:" : "VAT 15% Included:"}</span>
              <span>{formatPrice(order.vatAmount, lang)} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}</span>
            </div>
            <div className="receipt-calc-line total-grand">
              <span>{isAr ? "الإجمالي المدفوع:" : "Total Amount:"}</span>
              <span>{formatPrice(order.total, lang)} {isAr ? RESTAURANT_INFO.currencyAr : RESTAURANT_INFO.currencyEn}</span>
            </div>
          </div>

          {/* QR Verification for Barista Screen */}
          <div className="receipt-qr-center">
            <div ref={qrRef}><QRCodeSVG value={`ORDER:${order.orderId}|NAME:${order.customerName}|TOTAL:${order.total}`}
              size={110}
              fgColor="#0e3b2e"
            /></div>
            <span className="qr-receipt-hint">
              {isAr ? "أظهر رقم الطلب أو الرمز للكاشير عند الاستلام" : "Show this order number to the barista upon pick-up"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="receipt-actions-row">
          <div className="receipt-share-wrap">
            <button className="receipt-print-btn" onClick={() => setShareOpen(value => !value)} aria-expanded={shareOpen}>
              <Share2 size={16} />
              <span>Share QR Code</span>
            </button>
            {shareOpen && <div className="receipt-share-menu">
              {['WhatsApp', 'ShareChat', 'Instagram'].map(service => <button key={service} onClick={() => handleSocialShare(service)}>{service}</button>)}
            </div>}
          </div>
          <button className="receipt-done-btn" onClick={handleDownload}>
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
        {shareMessage && <p className="receipt-share-message" role="status">{shareMessage}</p>}
      </div>
    </div>
  );
}
