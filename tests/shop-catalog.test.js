import api from "../src/services/api";
import { fetchShopProducts } from "../src/services/shopCatalog";
jest.mock("../src/services/api", () => ({ get: jest.fn() }));

test("shop products use real Mongo IDs, VND prices, and server pagination", async () => {
  const source = {
    _id: "012345678901234567890123",
    name: "Laptop",
    price: 15000000,
    image: "image.webp",
  };
  api.get.mockResolvedValueOnce({ data: { data: [source], total: 21 } });
  const result = await fetchShopProducts({ query: "Laptop", skip: 12 });
  expect(api.get).toHaveBeenCalledWith(
    "/api/product/get-all-product",
    expect.objectContaining({
      params: { limit: 12, page: 1, name: "Laptop", status: "active" },
    }),
  );
  expect(result).toMatchObject({
    total: 21,
    products: [{ productId: source._id, source: "shop", currency: "VND" }],
  });
});

test("shop brand filtering is sent to the backend", async () => {
  api.get.mockResolvedValueOnce({ data: { data: [], total: 0 } });
  await fetchShopProducts({ brand: "Apple", skip: 0 });
  expect(api.get).toHaveBeenLastCalledWith(
    "/api/product/get-all-product",
    expect.objectContaining({
      params: expect.objectContaining({ brand: "Apple", page: 0 }),
    }),
  );
});
