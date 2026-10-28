import PRODUCTS from "../data/products.json";

export const PAGE_SIZE = 12;

function mapProduct(item) {
  return {
    productId: String(item.id),
    name: item.name,
    description: item.description,
    price: Number(item.price),
    currency: "VND",
    category: item.category || "",
    brand: item.brand || "",
    rating: item.rating || null,
    stock: item.stock || 0,
    image: item.image || (Array.isArray(item.images) ? item.images[0] : ""),
    images: Array.isArray(item.images) ? item.images : [],
  };
}

/**
 * Lấy danh sách sản phẩm với phân trang và tìm kiếm theo từ khóa.
 *
 * @param {object} options
 * @param {string} [options.query=""] - Từ khóa tìm kiếm
 * @param {number} [options.skip=0] - Vị trí bắt đầu
 * @param {number} [options.limit=PAGE_SIZE] - Số lượng mỗi trang
 * @param {AbortSignal} [options.signal] - AbortController signal
 * @returns {Promise<{ products, total, skip, limit }>}
 */
export async function fetchProducts({
  query = "",
  skip = 0,
  limit = PAGE_SIZE,
  signal,
} = {}) {
  // Simulate async (giữ cấu trúc thống nhất với hook useProducts)
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 50);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const trimmed = query.trim().toLowerCase();

  const filtered = trimmed
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          (p.category || "").toLowerCase().includes(trimmed) ||
          (p.brand || "").toLowerCase().includes(trimmed),
      )
    : PRODUCTS;

  const total = filtered.length;
  const products = filtered.slice(skip, skip + limit).map(mapProduct);

  return { products, total, skip, limit };
}

/**
 * Lấy chi tiết một sản phẩm theo ID.
 *
 * @param {string|number} productId
 * @param {AbortSignal} [signal]
 * @returns {Promise<object>}
 */
export async function fetchProductDetails(productId, signal) {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 50);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const found = PRODUCTS.find((p) => String(p.id) === String(productId));

  if (!found) {
    throw new Error(`Không tìm thấy sản phẩm có ID: ${productId}`);
  }

  return mapProduct(found);
}
