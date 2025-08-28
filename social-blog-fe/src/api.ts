import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

const rawAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function addSubscriber(cb: (token: string) => void) {
  subscribers.push(cb);
}

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(API(original));
          });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await rawAPI.post("/auth/refresh", { refreshToken });
        const { accessToken, refreshToken: newRefresh } = res.data;
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
          onRefreshed(accessToken);
        }
        isRefreshing = false;
        original.headers.Authorization = `Bearer ${accessToken}`;
        return API(original);
      } catch (e) {
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

export default API;
