import axios, { CanceledError, AxiosError, AxiosRequestConfig } from "axios";
import { clearLocalStorageAuth, getLocalStorageAuth, setLocalStorageAuth } from "../utils/localStorage";
import AuthService from "./AuthService";

export { CanceledError, AxiosError };

export const BASE_URL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void; config: AxiosRequestConfig }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      if (prom.config.headers) {
        prom.config.headers["Authorization"] = `JWT ${token}`;
      }
      apiClient(prom.config).then(prom.resolve).catch(prom.reject);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const auth = getLocalStorageAuth();
    if (auth) {
      if (config.headers["X-Use-Refresh-Token"]) {
        config.headers["Authorization"] = `JWT ${auth.tokens.refreshToken}`;
        delete config.headers["X-Use-Refresh-Token"];
      } else {
        config.headers["Authorization"] = `JWT ${auth.tokens.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const auth = getLocalStorageAuth();

      if (auth) {
        try {
          const { data: newAuth } = await AuthService.refreshTokens().request;
          setLocalStorageAuth(newAuth);
          apiClient.defaults.headers.common["Authorization"] = `JWT ${newAuth.tokens.accessToken}`;
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `JWT ${newAuth.tokens.accessToken}`;
          }
          processQueue(null, newAuth.tokens.accessToken);
          return apiClient(originalRequest);
        } catch (error) {
          processQueue(error as AxiosError, null);
          clearLocalStorageAuth();
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
