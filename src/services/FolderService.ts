import { IFolder } from "../common/types";
import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class SettingsService {
  private path = "/folders";

  createFolder(folder: IFolder) {
    const controller = new AbortController();
    const request = apiClient.post<IFolder>(this.path, folder, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  getUserFolders() {
    const controller = new AbortController();
    const request = apiClient.get<IFolder[]>(this.path, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  updateFolder(folder: IFolder) {
    const controller = new AbortController();
    const request = apiClient.put<IFolder>(`${this.path}/${folder._id}`, folder, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  deleteFolder(folderId:string) {
    const controller = new AbortController();
    const request = apiClient.delete(`${this.path}/${folderId}`, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new SettingsService();
