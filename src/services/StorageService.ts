import { IStorage } from "../common/types";
import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class StorageService {
  private path = "/storage";

  getUserStorage() {
    const controller = new AbortController();
    const request = apiClient.get<IStorage>(this.path, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new StorageService();
