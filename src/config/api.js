import Constants from "expo-constants";
import { Platform } from "react-native";
import { resolveApiUrl } from "./resolveApiUrl";

export const API_BASE_URL = resolveApiUrl({
  override: process.env.EXPO_PUBLIC_API_URL,
  hostUri:
    Constants.expoConfig?.hostUri || Constants.expoGoConfig?.debuggerHost,
  platform: Platform.OS,
  webHostname:
    typeof window !== "undefined" ? window.location?.hostname : undefined,
});

export function apiUrl(path) {
  if (!API_BASE_URL)
    throw new Error(
      "Chưa xác định được máy chủ API. Chạy npm start cùng mạng Wi-Fi, hoặc đặt EXPO_PUBLIC_API_URL rồi khởi động lại Expo.",
    );
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}
