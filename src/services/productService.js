export const PAGE_SIZE = 12;
const BASE_URL = "https://dummyjson.com/products";

function mapProduct(item) {
  return {
    productId: String(item.id),
    name: item.title,
    title: item.title,
    description: item.description,
    price: Number(item.price),
    currency: "USD",
    category: item.category,
    brand: item.brand,
    rating: item.rating,
    stock: item.stock,
    image: item.thumbnail || (Array.isArray(item.images) ? item.images[0] : ""),
    images: Array.isArray(item.images) ? item.images : [],
  };
}

export async function fetchProducts({ query = "", skip = 0, limit = PAGE_SIZE, signal } = {}) {
  const trimmed = query.trim();
  const url = trimmed
    ? `${BASE_URL}/search?q=${encodeURIComponent(trimmed)}&limit=${limit}&skip=${skip}`
    : `${BASE_URL}?limit=${limit}&skip=${skip}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.products) || typeof data.total !== "number") {
    throw new Error("Dữ liệu sản phẩm không hợp lệ");
  }

  return {
    total: data.total,
    skip: data.skip,
    limit: data.limit,
    products: data.products.map(mapProduct),
  };
}

export async function fetchProductDetails(productId, signal) {
  const url = `${BASE_URL}/${encodeURIComponent(productId)}`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Không tìm thấy sản phẩm (${response.status})`);
  }

  const data = await response.json();
  return mapProduct(data);
}
