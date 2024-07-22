import { IFile } from "../common/types";
import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class FileService {
  private path = "/file";

  getUserFiles() {
    const controller = new AbortController();
    const request = apiClient.get<IFile[]>(`${this.path}/user-files`, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  getFileByName(fileName: string) {
    const controller = new AbortController();
    const request = apiClient.get<IFile>(`${this.path}/${fileName}`, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new FileService();
