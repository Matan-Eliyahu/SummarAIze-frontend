import { TokenResponse } from "@react-oauth/google";
import { IAuth, IUser } from "../common/types";
import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

class AuthService {
  private path = "/auth";

  register(user: IUser) {
    const controller = new AbortController();
    const request = apiClient.post<{ _id: string }>(`${this.path}/register`, user, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  login(email: string, password: string) {
    const controller = new AbortController();
    const request = apiClient.post<IAuth>(`${this.path}/login`, { email, password }, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  googleLogin(tokenResponse: TokenResponse) {
    const controller = new AbortController();
    const request = apiClient.post<IAuth>(`${this.path}/google`, tokenResponse, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  logout() {
    const controller = new AbortController();
    const request = apiClient.get(`${this.path}/logout`, { headers: { "X-Use-Refresh-Token": "true" }, signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  refreshTokens() {
    const controller = new AbortController();
    const request = apiClient.get<IAuth>(`${this.path}/refresh`, { headers: { "X-Use-Refresh-Token": "true" }, signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new AuthService();
