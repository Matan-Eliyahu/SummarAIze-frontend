import axios, { CanceledError, AxiosError } from "axios";
import { clearLocalStorageAuth, getLocalStorageAuth, setLocalStorageAuth } from "../utils/localStorage";
import AuthService from "./AuthService";

export { CanceledError, AxiosError };

export const BASE_URL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
});

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
      originalRequest._retry = true;
      const auth = getLocalStorageAuth();

      if (auth) {
        try {
          const { data: newAuth } = await AuthService.refreshTokens().request;
          setLocalStorageAuth(newAuth);
          originalRequest.headers["Authorization"] = `JWT ${newAuth.tokens.accessToken}`;
          return apiClient(originalRequest);
        } catch (error) {
          clearLocalStorageAuth();
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
