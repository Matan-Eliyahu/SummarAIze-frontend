import { IFile } from "../common/types";
import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class FileService {
  private path = "/files";

  getUserFiles() {
    const controller = new AbortController();
    const request = apiClient.get<IFile[]>(`${this.path}/`, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  getFileByName(fileName: string) {
    const controller = new AbortController();
    const request = apiClient.get<IFile>(`${this.path}/${fileName}`, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  updateFileByName(fileName: string, transcribe: string, summary: string) {
    const controller = new AbortController();
    const request = apiClient.put<IFile>(`${this.path}/${fileName}`, { transcribe, summary }, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  deleteFileByName(fileName: string) {
    const controller = new AbortController();
    const request = apiClient.delete<IFile>(`${this.path}/${fileName}`, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new FileService();
