export function formatMoney(value, currency = "USD") {
  const numeric = typeof value === "number" ? value : Number(value) || 0;
  return new Intl.NumberFormat(currency === "VND" ? "vi-VN" : "en-US", {
    style: "currency",
    currency,
  }).format(numeric);
}
