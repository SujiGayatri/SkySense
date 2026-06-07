import axios from "axios";

const api = axios.create({ baseURL: "/api" });

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
