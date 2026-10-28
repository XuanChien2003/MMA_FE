import api from "./api";
export const PAGE_SIZE = 12;

// The backend forwards requests to the public WooCommerce Store API because
// the merchant does not send Access-Control-Allow-Origin to web clients.
export async function fetchShopProducts({
  query = "",
  skip = 0,
  signal,
  brand = "",
  category = "",
  fresh = false,
} = {}) {
  const { data } = await api.get("/api/product/get-all-product", {
    signal,
    params: {
      limit: PAGE_SIZE,
      page: Math.floor(skip / PAGE_SIZE),
      name: query,
      ...(brand ? { brand } : {}),
      ...(category ? { category } : {}),
      ...(fresh ? { fresh: "1" } : {}),
    },
  });
  if (!Array.isArray(data.data) || !Number.isFinite(data.total))
    throw new Error("Danh mục sản phẩm không hợp lệ.");
  return {
    total: data.total,
    products: data.data,
    stale: Boolean(data.stale),
    source: data.source,
  };
}
export async function fetchProductDetails(productId, signal) {
  const { data } = await api.get(
    `/api/product/details-product/${encodeURIComponent(productId)}`,
    { signal },
  );
  if (!data.data?.productId) throw new Error("Không tìm thấy sản phẩm");
  return { ...data.data, stale: Boolean(data.stale) };
}
