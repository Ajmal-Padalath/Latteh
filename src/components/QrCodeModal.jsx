import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Download,
  Share2,
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export default function QrCodeModal({
  isOpen,
  onClose,
  lang
}) {
  const [copied, setCopied] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [qrError, setQrError] = useState('');
  const qrRef = useRef(null);

  if (!isOpen) return null;

  const isAr = lang === 'ar';

  // Single official store menu URL
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const menuUrl = `${currentOrigin}${currentPath}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const getQrSvgData = async () => {
    const svg = document.getElementById('latteh-store-qr');
    if (!svg) throw new Error('QR code is not available');

    const exportedSvg = svg.cloneNode(true);
    const logo = exportedSvg.querySelector('image');
    if (!logo) throw new Error('QR code logo is not available');

    const logoPath = logo.getAttribute('href') || logo.getAttribute('xlink:href');
    if (!logoPath) throw new Error('QR code logo source is missing');

    const response = await fetch(new URL(logoPath, document.baseURI));
    if (!response.ok) throw new Error('QR code logo could not be loaded');

    const logoUrl = URL.createObjectURL(await response.blob());
    try {
      const logoImage = new Image();
      await new Promise((resolve, reject) => {
        logoImage.onload = resolve;
        logoImage.onerror = () => reject(new Error('QR code logo could not be decoded'));
        logoImage.src = logoUrl;
      });

      const logoCanvas = document.createElement('canvas');
      const logoSize = 128;
      logoCanvas.width = logoSize;
      logoCanvas.height = logoSize;
      const logoContext = logoCanvas.getContext('2d');
      if (!logoContext) throw new Error('Unable to prepare the QR code logo');

      const scale = Math.min(logoSize / logoImage.naturalWidth, logoSize / logoImage.naturalHeight);
      const width = logoImage.naturalWidth * scale;
      const height = logoImage.naturalHeight * scale;
      logoContext.drawImage(logoImage, (logoSize - width) / 2, (logoSize - height) / 2, width, height);
      logo.setAttribute('href', logoCanvas.toDataURL('image/png'));
      logo.removeAttribute('xlink:href');

      return new XMLSerializer().serializeToString(exportedSvg);
    } finally {
      URL.revokeObjectURL(logoUrl);
    }
  };

  // Convert the logo-embedded SVG QR to a PNG file for native sharing.
  const getQrFile = async () => {
    const svgData = await getQrSvgData();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);

    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('QR code image could not be generated'));
        img.src = blobURL;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Unable to prepare the QR code image');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error('QR code image could not be exported'));
        }, 'image/png');
      });
      return new File([blob], 'latteh-menu-qr.png', { type: 'image/png' });
    } finally {
      URL.revokeObjectURL(blobURL);
    }
  };

  // Share QR code and link through Web Share API or toggle social buttons
  const handleShare = async () => {
    setShowSocial(true);
    setQrError('');

    const shareTitle = isAr ? 'منيو مقهى لاتيه ليستر | رمز QR' : 'Latteh Leicester Menu | QR Code';
    const shareText = isAr
      ? `☕ تفضل بزيارة قائمة مقهى لاتيه ليستر الرقمية واطلب عبر الرابط:\n`
      : `☕ Explore Latteh Leicester Digital Menu & Artisan Coffee:\n`;

    if (navigator.share) {
      try {
        const file = await getQrFile();
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: shareTitle,
            text: `${shareText}${menuUrl}`,
            files: [file]
          });
          return;
        } else {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: menuUrl
          });
          return;
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setQrError(isAr ? "تعذر إنشاء رمز QR للمشاركة. يرجى المحاولة مرة أخرى." : "Unable to create the QR code for sharing. Please try again.");
        }
      }
    }
  };

  // Download an SVG QR with the logo embedded so it remains visible outside the page.
  const handleDownloadQr = async () => {
    setQrError('');
    try {
      const svgData = await getQrSvgData();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const SVGURL = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = SVGURL;
      downloadLink.download = 'latteh-cafe-menu-qr.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.setTimeout(() => URL.revokeObjectURL(SVGURL), 1000);
    } catch {
      setQrError(isAr ? "تعذر تنزيل رمز QR. يرجى المحاولة مرة أخرى." : "Unable to download the QR code. Please try again.");
    }
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
              <img src="./logo2.jpeg" alt="Latteh Logo" className="stand-logo" />
              <div className="stand-branding">
                <h4 className="stand-title-ar">{RESTAURANT_INFO.nameAr}</h4>
                <span className="stand-title-en">Latteh Leicester</span>
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
                    src: "./qr-logo.PNG",
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

          {/* Action Buttons: Share QR Code & Download QR */}
          <div className="qr-action-row">
            <button className="qr-primary-btn" onClick={handleShare}>
              <Share2 size={16} />
              <span>{isAr ? "مشاركة رمز QR" : "Share QR Code"}</span>
            </button>
            <button className="qr-secondary-btn" onClick={handleDownloadQr}>
              <Download size={16} />
              <span>{isAr ? "تحميل رمز QR" : "Download QR Code"}</span>
            </button>
          </div>
          {qrError && <p className="qr-export-error" role="alert">{qrError}</p>}

          {/* Social Media Sharing Strip */}
          {showSocial && (
            <div className="social-share-section animate-fade-in">
              <div className="social-share-header">
                <span>{isAr ? "مشاركة سريعة عبر وسائل التواصل:" : "Share via social media:"}</span>
              </div>
              <div className="social-share-grid">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    (isAr ? '☕ تفضل بزيارة قائمة مقهى لاتيه ليستر الرقمية:\n' : '☕ Explore Latteh Leicester Digital Menu:\n') + menuUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-share-item social-whatsapp"
                  title="WhatsApp"
                >
                  <svg className="social-svg-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(menuUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-share-item social-snapchat"
                  title="Snapchat"
                >
                  <svg className="social-svg-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1.5c-3.3 0-5.34 2.52-5.34 5.85 0 .99.15 2.1.3 3.09-.48.27-1.05.42-1.62.42-.39 0-.75-.09-1.08-.24-.24-.12-.51-.03-.63.21-.12.24-.03.51.21.63.45.24.96.36 1.5.36.75 0 1.47-.21 2.1-.63l.15.93c.06.48-.12.96-.51 1.26-.84.66-1.8 1.26-2.85 1.62-.39.12-.63.48-.57.9.06.39.39.69.78.72.66.06 1.32.21 1.95.45.3.12.51.36.57.69l.06.36c.06.36.36.63.72.63.84 0 1.65.27 2.34.78.57.42 1.26.63 1.95.63s1.38-.21 1.95-.63c.69-.51 1.5-.78 2.34-.78.36 0 .66-.27.72-.63l.06-.36c.06-.33.27-.57.57-.69.63-.24 1.29-.39 1.95-.45.39-.03.72-.33.78-.72.06-.42-.18-.78-.57-.9-1.05-.36-2.01-.96-2.85-1.62-.39-.3-.57-.78-.51-1.26l.15-.93c.63.42 1.35.63 2.1.63.54 0 1.05-.12 1.5-.36.24-.12.33-.39.21-.63-.12-.24-.39-.33-.63-.21-.33.15-.69.24-1.08.24-.57 0-1.14-.15-1.62-.42.15-.99.3-2.1.3-3.09C17.34 4.02 15.3 1.5 12 1.5z" />
                  </svg>
                  <span>Snapchat</span>
                </a>

                <a
                  href={`https://www.instagram.com/${RESTAURANT_INFO.instagram.replace(/^@/, '')}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-share-item social-instagram"
                  title="Instagram"
                >
                  <svg className="social-svg-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.25-3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
