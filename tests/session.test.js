import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../src/redux/authSlice";
jest.mock("@react-native-async-storage/async-storage", () => {
  const items = new Map();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key) => items.get(key) || null),
      setItem: jest.fn(async (key, value) => items.set(key, value)),
      removeItem: jest.fn(async (key) => items.delete(key)),
    },
  };
});

test("reopening the app restores the logged-in user and logout clears the persisted session", async () => {
  await AsyncStorage.setItem(
    "persist:auth",
    JSON.stringify({
      userId: JSON.stringify("demo-id"),
      token: JSON.stringify("demo-token"),
      isLoggedIn: JSON.stringify(true),
      isAdmin: JSON.stringify(false),
      fullname: JSON.stringify("Demo"),
      _persist: JSON.stringify({ version: -1, rehydrated: true }),
    }),
  );
  const { store, persistor } = require("../src/redux/store");
  await new Promise((resolve) => {
    if (persistor.getState().bootstrapped) return resolve();
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        unsubscribe();
        resolve();
      }
    });
  });
  expect(store.getState().auth).toMatchObject({
    userId: "demo-id",
    isLoggedIn: true,
    fullname: "Demo",
  });
  store.dispatch(logoutUser());
  await persistor.flush();
  const persisted = JSON.parse(await AsyncStorage.getItem("persist:auth"));
  expect(JSON.parse(persisted.userId)).toBeNull();
  expect(JSON.parse(persisted.token)).toBeNull();
  persistor.pause();
});
