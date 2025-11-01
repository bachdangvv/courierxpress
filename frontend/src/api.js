import axios from "axios";
import Cookies from "js-cookie";

// Resolve baseURL robustly (works even if Vite env didn’t load yet)
const RAW = import.meta.env?.VITE_API_URL || "";
const BASE = (RAW || "http://localhost:8000").replace(/\/+$/,""); // strip trailing /
const api = axios.create({ 
  baseURL: BASE,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  }, 
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("XSRF-TOKEN");
  if (token) config.headers["X-XSRF-TOKEN"] = token;
  return config;
});

// export function setToken(token) {
//   if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
//   else delete api.defaults.headers.common.Authorization;
// }

// DEBUG: keep this for now so you can see it in the console
/* eslint-disable no-console */
console.log(">>> API baseURL =", api.defaults.baseURL);
export default api;
