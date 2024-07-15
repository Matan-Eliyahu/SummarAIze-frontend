import axios, { CanceledError, AxiosError } from "axios";
import { getLocalStorageAuth } from "../utils/localStorage";

export { CanceledError, AxiosError };

const baseURL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
  baseURL: baseURL,
});

apiClient.interceptors.request.use(
  (config) => {
    const auth = getLocalStorageAuth();
    if (auth) {
      if (config.headers["X-Use-Refresh-Token"]) {
        config.headers["Authorization"] = `JWT ${auth.refreshToken}`;
        delete config.headers["X-Use-Refresh-Token"];
      } else {
        config.headers["Authorization"] = `JWT ${auth.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
