import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class UploadsService {
  private path = "/uploads";

  getStaticFileByPath(filePath: string) {
    const controller = new AbortController();
    const request = apiClient.get(`${this.path}/${filePath}`, {
      responseType: "blob",
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
}

export default new UploadsService();
