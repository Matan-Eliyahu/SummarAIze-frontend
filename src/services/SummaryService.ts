import { ISummaryData } from "../common/types";
import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class SummaryService {
  private path = "/summarize";

  createSummary(file: File) {
    const controller = new AbortController();
    const formData = new FormData();
    formData.append("file", file);
    const request = apiClient.post<string>(`${this.path}/`, formData, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  summaryAdjustment(summaryData: ISummaryData) {
    const controller = new AbortController();
    const request = apiClient.post<string>(`${this.path}/adjust`, summaryData, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new SummaryService();
