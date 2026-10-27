import axios from "axios";
import {
  fetchProduct,
  fetchProducts,
  PAGE_SIZE,
} from "../src/services/catalog";
jest.mock("axios", () => ({ get: jest.fn() }));
const sample = {
  id: 101,
  title: "Phone",
  price: 9.99,
  thumbnail: "image.png",
  description: "Details",
};
beforeEach(() => axios.get.mockReset());
test("search and pagination use the public API and normalize currency and IDs", async () => {
  axios.get.mockResolvedValue({ data: { products: [sample], total: 99 } });
  const result = await fetchProducts({
    query: " phone ",
    skip: 12,
    fresh: true,
  });
  expect(axios.get).toHaveBeenCalledWith(
    "https://dummyjson.com/products/search",
    expect.objectContaining({
      params: { limit: PAGE_SIZE, skip: 12, q: "phone" },
      timeout: 15000,
    }),
  );
  expect(result.products[0]).toMatchObject({
    productId: "dummyjson:101",
    name: "Phone",
    currency: "USD",
    source: "dummyjson",
  });
});
test("detail cache is reused, but a fresh request bypasses it", async () => {
  axios.get.mockResolvedValue({ data: sample });
  await fetchProduct(101, { fresh: true });
  const product = await fetchProduct(101);
  expect(product.description).toBe("Details");
  expect(axios.get).toHaveBeenCalledTimes(1);
  await fetchProduct(101, { fresh: true });
  expect(axios.get).toHaveBeenCalledTimes(2);
});
test("invalid responses and network failures are surfaced", async () => {
  axios.get
    .mockResolvedValueOnce({ data: {} })
    .mockRejectedValueOnce(new Error("offline"));
  await expect(
    fetchProducts({ query: "invalid", fresh: true }),
  ).rejects.toThrow();
  await expect(fetchProduct(999, { fresh: true })).rejects.toThrow("offline");
});
