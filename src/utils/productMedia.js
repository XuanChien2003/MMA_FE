import { API_BASE_URL } from "../config/api";

export function productImageUrl(uri) {
  if (typeof uri !== "string" || !uri.trim()) return undefined;
  const value = uri.trim();
  if (/^(https?:|data:|file:|content:)/i.test(value)) return value;
  if (value.startsWith("/"))
    return API_BASE_URL ? `${API_BASE_URL}${value}` : undefined;
  return value;
}

export function productImages(product) {
  return [
    ...new Set(
      (product?.images?.length ? product.images : [product?.image]).filter(
        Boolean,
      ),
    ),
  ];
}
