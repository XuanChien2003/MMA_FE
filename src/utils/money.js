/**
 * Định dạng giá tiền theo đơn vị tiền tệ.
 * Mặc định VND — hiển thị theo định dạng tiếng Việt (ví dụ: 34.990.000 ₫).
 *
 * @param {number} value - Giá trị số
 * @param {string} [currency="VND"] - Đơn vị tiền tệ (VND, USD, ...)
 * @returns {string}
 */
export function formatMoney(value, currency = "VND") {
  const numeric = typeof value === "number" ? value : Number(value) || 0;
  const locale = currency === "VND" ? "vi-VN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(numeric);
}
