import axios from "axios";
import { API_BASE_URL, apiUrl } from "../config/api";

const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });
api.interceptors.request.use((config) => {
  // Fail locally instead of accidentally resolving a relative URL on the phone.
  apiUrl(config.url || "");
  return config;
});
export default api;
