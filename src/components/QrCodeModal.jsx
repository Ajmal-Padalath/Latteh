import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Printer,
  Download,
  Share2,
  ExternalLink,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function QrCodeModal({
  isOpen,
  onClose,
  lang
}) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  // Single official store menu URL
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const menuUrl = `${currentOrigin}${currentPath}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  // Download SVG / PNG QR
  const handleDownloadQr = () => {
    const svg = document.getElementById('latteh-store-qr');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const SVGURL = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = SVGURL;
    downloadLink.download = 'latteh-cafe-menu-qr.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content qr-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="qr-modal-header">
          <div className="qr-title-box">
            <QrCode size={22} className="text-gold" />
            <div>
              <h3 className="modal-heading-title">
                {isAr ? "رمز QR الرسمي لقائمة المحل" : "Official Store Menu QR Code"}
              </h3>
              <p className="modal-heading-subtitle">
                {isAr ? "كود موحد لجميع العملاء لمسح المنيو والطلب" : "One single QR code for all customers"}
              </p>
            </div>
          </div>
          <button className="modal-close-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Counter Stand / Store Poster Card */}
        <div className="qr-generator-view">
          <div className="qr-stand-card" id="printable-qr-stand" ref={qrRef}>
            <div className="stand-card-header">
              <img src="./logo1.PNG" alt="Latteh Logo" className="stand-logo" />
              <div className="stand-branding">
                <h4 className="stand-title-ar">{RESTAURANT_INFO.nameAr}</h4>
                <span className="stand-title-en">Latteh Cafe</span>
              </div>
            </div>

            <div className="stand-tagline">
              <span>{isAr ? "قائمة المشروبات والحلويات الرقمية" : "Digital Beverage & Dessert Menu"}</span>
            </div>

            <div className="stand-qr-wrapper">
              <div className="qr-frame">
                <QRCodeSVG
                  id="latteh-store-qr"
                  value={menuUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                  fgColor="#0e3b2e"
                  bgColor="#ffffff"
                  imageSettings={{
                    src: "./logo1.PNG",
                    x: undefined,
                    y: undefined,
                    height: 42,
                    width: 42,
                    excavate: true,
                  }}
                />
              </div>
            </div>

            <div className="stand-card-footer">
              <div className="stand-instructions">
                <p className="instruction-ar">امسح الكود بكاميرا الجوال لعرض المنيو والطلب</p>
                <p className="instruction-en">Scan with your smartphone camera to view menu</p>
              </div>
              <div className="stand-perks">
                <span>✦ بدون تحميل تطبيق</span>
                <span>✦ أسعار شاملة للضريبة</span>
                <span>✦ تحديث مباشر</span>
              </div>
            </div>
          </div>

          {/* URL Box */}
          <div className="qr-url-box">
            <span className="qr-url-text">{menuUrl}</span>
            <button className="copy-link-btn" onClick={handleCopyLink}>
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              <span>{copied ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "نسخ الرابط" : "Copy Link")}</span>
            </button>
          </div>

          {/* Action Buttons: Print Counter Poster & Download QR */}
          <div className="qr-action-row">
            <button className="qr-primary-btn" onClick={handlePrint}>
              <Printer size={16} />
              <span>{isAr ? "طباعة كرت الكاونتر" : "Print Counter Stand"}</span>
            </button>
            <button className="qr-secondary-btn" onClick={handleDownloadQr}>
              <Download size={16} />
              <span>{isAr ? "تحميل رمز QR" : "Download QR Code"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
