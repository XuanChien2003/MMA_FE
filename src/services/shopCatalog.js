import api from "./api";
import { PAGE_SIZE } from "./catalog";

export async function fetchShopProducts({
  query = "",
  skip = 0,
  signal,
  brand = "",
} = {}) {
  const { data } = await api.get("/api/product/get-all-product", {
    signal,
    params: {
      limit: PAGE_SIZE,
      page: Math.floor(skip / PAGE_SIZE),
      name: query,
      status: "active",
      ...(brand ? { brand } : {}),
    },
  });
  if (!Array.isArray(data.data) || !Number.isFinite(data.total))
    throw new Error("Dữ liệu sản phẩm cửa hàng không hợp lệ.");
  return {
    total: data.total,
    products: data.data.map((product) => ({
      ...product,
      productId: product._id,
      id: product._id,
      source: "shop",
      currency: "VND",
    })),
  };
}
