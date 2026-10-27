import axios from "axios";
import { API_BASE_URL, apiUrl } from "../config/api";

const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });
api.interceptors.request.use((config) => {
  // Fail locally instead of accidentally resolving a relative URL on the phone.
  apiUrl(config.url || "");
  return config;
});
export default api;

export async function fetchApi(path, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    return await fetch(apiUrl(path), { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
