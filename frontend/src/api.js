import axios from "axios";

// Resolve baseURL robustly (works even if Vite env didn’t load yet)
const RAW = import.meta.env?.VITE_API_URL || "";
const BASE = (RAW || "http://localhost:8000/api").replace(/\/+$/,""); // strip trailing /
const api = axios.create({ baseURL: BASE });

export function setToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

// DEBUG: keep this for now so you can see it in the console
/* eslint-disable no-console */
console.log(">>> API baseURL =", api.defaults.baseURL);
export default api;
