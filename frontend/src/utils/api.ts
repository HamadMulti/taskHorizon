/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import refreshAccessToken from "./refresh_token";
import Cookies from "js-cookie";

const url = import.meta.env.VITE_API_BASE_URL

// const url = "https://taskhorizon.onrender.com"

const API = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((newToken: any) => void)[] = [];

const onRefreshed = (token: any) => {
  refreshSubscribers.map((callback) => callback(token));
  refreshSubscribers = [];
};

API.interceptors.request.use(
  async (config) => {
    let token = Cookies.get("access_token");

    if (!token) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onRefreshed(newToken);

        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (err) {
        isRefreshing = false;
        console.error("Session expired, redirecting to login");
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);


export default API;