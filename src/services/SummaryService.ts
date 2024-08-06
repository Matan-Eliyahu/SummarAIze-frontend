import { IFile, ISummaryOptions } from "../common/types";
import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class SummaryService {
  private path = "/summarize";

  summarize(fileId: string, summaryOptions: ISummaryOptions) {
    const controller = new AbortController();
    const request = apiClient.post<IFile>(`${this.path}/${fileId}`, summaryOptions, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new SummaryService();
