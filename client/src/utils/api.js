import axios from "axios";

// In development: uses Vite proxy → localhost:5000
// In production: uses your Render backend URL
const baseURL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api";

const api = axios.create({ baseURL });

export const weatherAPI = {
  get: (params) => api.get("/weather", { params }),
};

export const favoritesAPI = {
  getAll: () => api.get("/favorites"),
  add: (data) => api.post("/favorites", data),
  remove: (city) => api.delete(`/favorites/${encodeURIComponent(city)}`),
  check: (city) => api.get(`/favorites/check/${encodeURIComponent(city)}`),
};

export const historyAPI = {
  getAll: () => api.get("/history"),
  add: (data) => api.post("/history", data),
  clear: () => api.delete("/history"),
};

export default api;