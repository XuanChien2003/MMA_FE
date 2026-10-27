import React from "react";
import { act, create } from "react-test-renderer";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import reducer, {
  addToCart,
  updateQuantity,
  decreaseQuantity,
  deleteProduct,
  resetCart,
  selectCartSummary,
} from "../src/redux/orebiSlices";
import useCart from "../src/hooks/useCart";

const product = {
  productId: "dummyjson:1",
  name: "Test",
  price: 9.99,
  currency: "USD",
  source: "dummyjson",
  quantity: 1,
};
test("adding the same product updates quantity, totals, and count", () => {
  let cart = reducer(undefined, addToCart(product));
  cart = reducer(cart, addToCart({ ...product, quantity: 2 }));
  expect(cart.products).toHaveLength(1);
  expect(selectCartSummary({ orebiSlices: cart })).toEqual({
    itemCount: 3,
    totals: { USD: 29.97 },
  });
});
test("quantity cannot become negative, zero, fractional, or infinite", () => {
  let cart = reducer(undefined, addToCart(product));
  for (const quantity of [-1, 0, 1.5, NaN, Infinity]) {
    cart = reducer(
      cart,
      updateQuantity({ productId: product.productId, quantity }),
    );
    cart = reducer(cart, addToCart({ ...product, quantity }));
  }
  cart = reducer(cart, decreaseQuantity({ productId: product.productId }));
  expect(cart.products[0].quantity).toBe(1);
});
test("public USD products and existing shop VND products have separate totals", () => {
  let cart = reducer(undefined, addToCart(product));
  cart = reducer(
    cart,
    addToCart({ productId: "shop-id", price: 200000, quantity: 2 }),
  );
  expect(selectCartSummary({ orebiSlices: cart })).toEqual({
    itemCount: 3,
    totals: { USD: 9.99, VND: 400000 },
  });
  cart = reducer(cart, deleteProduct(product.productId));
  expect(selectCartSummary({ orebiSlices: cart })).toEqual({
    itemCount: 2,
    totals: { VND: 400000 },
  });
  expect(reducer(cart, resetCart()).products).toEqual([]);
});
test("invalid products are rejected", () => {
  expect(
    reducer(undefined, addToCart({ ...product, price: NaN })).products,
  ).toEqual([]);
  expect(
    reducer(undefined, addToCart({ ...product, productId: null })).products,
  ).toEqual([]);
});
test("useCart propagates actions and live totals through Redux", () => {
  const store = configureStore({ reducer: { orebiSlices: reducer } });
  let cart;
  function Probe() {
    cart = useCart();
    return null;
  }
  let renderer;
  act(() => {
    renderer = create(
      React.createElement(Provider, { store }, React.createElement(Probe)),
    );
  });
  act(() => cart.addItem(product));
  act(() => cart.setQuantity(product.productId, 4));
  expect(cart.itemCount).toBe(4);
  expect(cart.totals.USD).toBe(39.96);
  act(() => cart.removeItem(product.productId));
  expect(cart.itemCount).toBe(0);
  act(() => renderer.unmount());
});
