const arabicIndicDigits = '٠١٢٣٤٥٦٧٨٩';

export function formatPrice(value, lang) {
  const price = String(value);
  return lang === 'ar'
    ? price
      .replace(/\d/g, (digit) => arabicIndicDigits[Number(digit)])
      .replace(/\./g, '٫')
    : price;
}
