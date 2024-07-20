import { ISettings } from "../common/types";
import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class SettingsService {
  private path = "/settings";

  getSettingsByUserId(userId: string) {
    const controller = new AbortController();
    const request = apiClient.get<ISettings>(`${this.path}/${userId}`, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  updateSettingsByUserId(userId: string, updateSettings: ISettings) {
    const controller = new AbortController();
    const request = apiClient.put<ISettings>(`${this.path}/${userId}`, updateSettings, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new SettingsService();
