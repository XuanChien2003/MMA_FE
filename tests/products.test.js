import React from "react";
import { act, create } from "react-test-renderer";
import useProducts from "../src/hooks/useProducts";
import { fetchProducts } from "../src/services/catalog";
jest.mock("../src/services/catalog", () => ({ fetchProducts: jest.fn() }));
const item = (id) => ({ productId: `dummyjson:${id}`, name: `Product ${id}` });
let renderer, current;
function Probe({ query }) {
  current = useProducts(query);
  return null;
}
const mount = async (query = "") => {
  await act(async () => {
    renderer = create(React.createElement(Probe, { query }));
  });
};
beforeEach(() => {
  fetchProducts.mockReset();
});
afterEach(() => {
  act(() => renderer?.unmount());
});

test("pagination appends pages, deduplicates, and stops at the total", async () => {
  fetchProducts
    .mockResolvedValueOnce({ products: [item(1), item(2)], total: 4 })
    .mockResolvedValueOnce({ products: [item(2), item(3)], total: 4 });
  await mount();
  await act(async () => {
    await current.loadMore();
  });
  expect(fetchProducts.mock.calls[1][0].skip).toBe(2);
  expect(current.products.map((product) => product.productId)).toEqual([
    "dummyjson:1",
    "dummyjson:2",
    "dummyjson:3",
  ]);
  await act(async () => {
    await current.loadMore();
  });
  expect(fetchProducts).toHaveBeenCalledTimes(2);
  expect(current.hasMore).toBe(false);
});
test("simultaneous end-reached events trigger only one request", async () => {
  let finish;
  fetchProducts.mockReturnValueOnce(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  await mount();
  act(() => {
    current.loadMore();
    current.loadMore();
  });
  expect(fetchProducts).toHaveBeenCalledTimes(1);
  await act(async () => finish({ products: [], total: 0 }));
  expect(current.loading).toBe(false);
});
test("changing search discards a late response from the old query", async () => {
  let finishOld;
  fetchProducts
    .mockReturnValueOnce(
      new Promise((resolve) => {
        finishOld = resolve;
      }),
    )
    .mockResolvedValueOnce({ products: [item(99)], total: 1 });
  await mount();
  await act(async () => {
    renderer.update(React.createElement(Probe, { query: "phone" }));
  });
  expect(fetchProducts.mock.calls[0][0].signal.aborted).toBe(true);
  await act(async () => finishOld({ products: [item(1)], total: 1 }));
  expect(current.products).toEqual([item(99)]);
  expect(fetchProducts.mock.calls[1][0]).toMatchObject({
    query: "phone",
    skip: 0,
  });
});
test("failed next page keeps existing products and can retry the same offset", async () => {
  fetchProducts
    .mockResolvedValueOnce({ products: [item(1)], total: 2 })
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce({ products: [item(2)], total: 2 });
  await mount();
  await act(async () => {
    await current.loadMore();
  });
  expect(current.error).toBeTruthy();
  expect(current.products).toEqual([item(1)]);
  await act(async () => {
    await current.loadMore();
  });
  expect(fetchProducts.mock.calls[2][0].skip).toBe(1);
  expect(current.products).toHaveLength(2);
  expect(current.error).toBe("");
});
test("refresh bypasses cache and replaces the list, including after a failed refresh", async () => {
  fetchProducts
    .mockResolvedValueOnce({ products: [item(1), item(2)], total: 2 })
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce({ products: [item(3)], total: 1 });
  await mount();
  await act(async () => {
    await current.refresh();
  });
  expect(current.products).toHaveLength(2);
  await act(async () => {
    await current.loadMore();
  });
  expect(fetchProducts.mock.calls[2][0]).toMatchObject({
    skip: 0,
    fresh: true,
  });
  expect(current.products).toEqual([item(3)]);
});

test("an initial error can retry and return an empty result", async () => {
  fetchProducts
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce({ products: [], total: 0 });
  await mount("missing");
  expect(current.error).toBeTruthy();
  expect(current.loading).toBe(false);
  await act(async () => {
    await current.refresh();
  });
  expect(current.products).toEqual([]);
  expect(current.total).toBe(0);
  expect(current.hasMore).toBe(false);
  expect(current.error).toBe("");
});

test("unmount cancels the active refresh request", async () => {
  let finishRefresh;
  fetchProducts
    .mockResolvedValueOnce({ products: [item(1)], total: 1 })
    .mockReturnValueOnce(
      new Promise((resolve) => {
        finishRefresh = resolve;
      }),
    );
  await mount();
  act(() => {
    current.refresh();
  });
  const signal = fetchProducts.mock.calls[1][0].signal;
  act(() => {
    renderer.unmount();
  });
  renderer = null;
  expect(signal.aborted).toBe(true);
  await act(async () => {
    finishRefresh({ products: [item(2)], total: 1 });
  });
});
