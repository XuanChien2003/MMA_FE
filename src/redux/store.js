import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { createMigrate, persistReducer, persistStore } from "redux-persist";
import cart from "./orebiSlices";
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  timeout: 0,
  version: 3,
  migrate: createMigrate({
    3: (state) =>
      state
        ? {
            ...state,
            products: (state.products || [])
              .filter((p) => /^shoptaycam:\d+$/.test(p.catalogKey || ""))
              .map((p) => ({
                ...p,
                productId: p.catalogKey.split(":")[1],
                id: Number(p.catalogKey.split(":")[1]),
                countInStock: p.countInStock === 0 ? 0 : null,
              })),
          }
        : state,
  }),
};
export const store = configureStore({
  reducer: { orebiSlices: persistReducer(persistConfig, cart) },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export const persistor = persistStore(store);
