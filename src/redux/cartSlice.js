import { createSelector, createSlice } from "@reduxjs/toolkit";

const validQuantity = (quantity) =>
  Number.isSafeInteger(quantity) && quantity > 0;

const cartSlice = createSlice({
  name: "cart",
  initialState: { products: [] },
  reducers: {
    addToCart: (state, { payload }) => {
      const quantity = payload.quantity ?? 1;
      if (
        !payload.productId ||
        !Number.isFinite(payload.price) ||
        payload.price < 0 ||
        !validQuantity(quantity)
      ) {
        return;
      }
      const existing = state.products.find(
        (p) => p.productId === payload.productId,
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.products.push({
          productId: payload.productId,
          name: payload.name || payload.title,
          title: payload.title || payload.name,
          price: Number(payload.price),
          image: payload.image || "",
          currency: payload.currency || "VND",
          quantity,
        });
      }
    },
    updateQuantity: (state, { payload }) => {
      const { productId, quantity } = payload;
      if (!validQuantity(quantity)) return;
      const item = state.products.find((p) => p.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    deleteProduct: (state, { payload: productId }) => {
      state.products = state.products.filter((p) => p.productId !== productId);
    },
    clearCart: (state) => {
      state.products = [];
    },
  },
});

export const selectCartSummary = createSelector(
  [(state) => state.cart.products],
  (products) => {
    let itemCount = 0;
    let totalPrice = 0;
    for (const item of products) {
      itemCount += item.quantity;
      totalPrice += Number(item.price) * item.quantity;
    }
    return {
      itemCount,
      totalPrice: Math.round(totalPrice * 100) / 100,
    };
  },
);

export const { addToCart, updateQuantity, deleteProduct, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
