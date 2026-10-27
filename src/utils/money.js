export function formatMoney(value, currency = "VND") {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(
    value,
  );
}
