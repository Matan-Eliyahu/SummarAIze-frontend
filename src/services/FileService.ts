import { IFile, IFileInfo } from "../common/types";
import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class FileService {
  private path = "/files";

  getUserFiles() {
    const controller = new AbortController();
    const request = apiClient.get<IFileInfo[]>(`${this.path}`, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  searchFiles(query: string) {
    const controller = new AbortController();
    const request = apiClient.get<IFile[]>(`${this.path}`, {
      params: { query },
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  getFileById(fileId: string) {
    const controller = new AbortController();
    const request = apiClient.get<IFile>(`${this.path}/${fileId}`, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  updateFileById(fileId: string, transcribe: string, summary: string) {
    const controller = new AbortController();
    const request = apiClient.put<IFile>(`${this.path}/${fileId}`, { transcribe, summary }, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  deleteFileById(fileId: string) {
    const controller = new AbortController();
    const request = apiClient.delete(`${this.path}/${fileId}`, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  deleteMultipleFilesById(filesId: string[]) {
    const controller = new AbortController();
    const request = apiClient.post<{ fileId: string; status: string }[]>(`${this.path}/delete-multiple`, { filesId }, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new FileService();
