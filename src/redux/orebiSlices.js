import { createSelector, createSlice } from "@reduxjs/toolkit";

const validQuantity = (quantity) =>
  Number.isSafeInteger(quantity) && quantity > 0;
export const orebiSlice = createSlice({
  name: "orebiSlices",
  initialState: { products: [] },
  reducers: {
    addToCart: (state, { payload }) => {
      const quantity = payload.quantity ?? 1;
      if (
        !payload.productId ||
        !Number.isFinite(payload.price) ||
        payload.price < 0 ||
        !validQuantity(quantity)
      )
        return;
      const existing = state.products.find(
        (item) => item.productId === payload.productId,
      );
      if (existing) {
        if (validQuantity(existing.quantity + quantity))
          existing.quantity += quantity;
      } else {
        state.products.push({
          ...payload,
          quantity,
          currency: payload.currency || "VND",
        });
      }
    },
    increaseQuantity: (state, { payload }) => {
      const item = state.products.find(
        (product) => product.productId === payload.productId,
      );
      if (item && validQuantity(item.quantity + 1)) item.quantity += 1;
    },
    decreaseQuantity: (state, { payload }) => {
      const item = state.products.find(
        (product) => product.productId === payload.productId,
      );
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    updateQuantity: (state, { payload }) => {
      if (!validQuantity(payload.quantity)) return;
      const item = state.products.find(
        (product) => product.productId === payload.productId,
      );
      if (item) item.quantity = payload.quantity;
    },
    deleteProduct: (state, { payload }) => {
      state.products = state.products.filter(
        (item) => item.productId !== payload,
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
    setCart: (state, { payload }) => {
      if (!Array.isArray(payload)) return;
      state.products = payload.filter(
        (item) =>
          item?.productId &&
          Number.isFinite(item.price) &&
          item.price >= 0 &&
          validQuantity(item.quantity),
      );
    },
  },
});
export const selectCartTotalQuantity = (state) =>
  state.orebiSlices.products.reduce((total, item) => total + item.quantity, 0);
export const selectCartSummary = createSelector(
  [(state) => state.orebiSlices.products],
  (products) => {
    const totals = {};
    let itemCount = 0;
    for (const item of products) {
      const currency = item.currency || "VND";
      totals[currency] =
        (totals[currency] || 0) + Math.round(item.price * 100) * item.quantity;
      itemCount += item.quantity;
    }
    for (const currency of Object.keys(totals)) totals[currency] /= 100;
    return { itemCount, totals };
  },
);
export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  deleteProduct,
  resetCart,
  setCart,
} = orebiSlice.actions;
export default orebiSlice.reducer;
