import axios from "axios";

const API_URL = "https://dummyjson.com/products";
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
export const PAGE_SIZE = 12;

export function normalizeProduct(product) {
  return {
    productId: `dummyjson:${product.id}`,
    id: product.id,
    name: product.title,
    image: product.thumbnail || product.images?.[0],
    description: product.description,
    price: product.price,
    brand: product.brand || product.category,
    currency: "USD",
    source: "dummyjson",
  };
}

async function request(path, params, { signal, fresh = false } = {}) {
  const key = JSON.stringify([path, params]);
  const cached = cache.get(key);
  if (!fresh && cached && Date.now() - cached.time < CACHE_TTL)
    return cached.data;
  const { data } = await axios.get(`${API_URL}${path}`, {
    params,
    signal,
    timeout: 15000,
  });
  if (cache.size >= 40) cache.delete(cache.keys().next().value);
  cache.set(key, { data, time: Date.now() });
  return data;
}

export async function fetchProducts({ query = "", skip = 0, ...options } = {}) {
  const search = query.trim();
  const data = await request(
    search ? "/search" : "",
    {
      limit: PAGE_SIZE,
      skip,
      ...(search ? { q: search } : {}),
    },
    options,
  );
  if (!Array.isArray(data.products) || !Number.isFinite(data.total)) {
    throw new Error("Dữ liệu sản phẩm không hợp lệ.");
  }
  return { products: data.products.map(normalizeProduct), total: data.total };
}

export async function fetchProduct(id, options) {
  const data = await request(`/${encodeURIComponent(id)}`, undefined, options);
  if (!data.id || !Number.isFinite(data.price))
    throw new Error("Không tìm thấy sản phẩm.");
  return normalizeProduct(data);
}
