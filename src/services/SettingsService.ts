import { ISettings } from "../common/types";
import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class SettingsService {
  private path = "/settings";

  getSettingsByUserId() {
    const controller = new AbortController();
    const request = apiClient.get<ISettings>(this.path, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  updateSettingsByUserId(updateSettings: ISettings) {
    const controller = new AbortController();
    const request = apiClient.put<ISettings>(this.path, updateSettings, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new SettingsService();
