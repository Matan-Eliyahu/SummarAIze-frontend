import { IFile, IFolder } from "../common/types";
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

  searchFolders(query: string) {
    const controller = new AbortController();
    const request = apiClient.get<IFolder[]>(`${this.path}`, {
      params: { query },
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  getFolderById(folderId: string) {
    const controller = new AbortController();
    const request = apiClient.get<IFolder>(`${this.path}/${folderId}`, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  updateFolderById(folder: IFolder) {
    const controller = new AbortController();
    const request = apiClient.put<IFolder>(`${this.path}/${folder._id}`, folder, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  deleteFolderById(folderId: string) {
    const controller = new AbortController();
    const request = apiClient.delete(`${this.path}/${folderId}`, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  deleteMultipleFoldersById(foldersId: string[]) {
    const controller = new AbortController();
    const request = apiClient.post(`${this.path}/delete-multiple`, { foldersId }, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  smartSearch(folderId: string, query: string) {
    const controller = new AbortController();
    const request = apiClient.get<IFile[]>(`${this.path}/smart-search/${folderId}`, { params: { query }, signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new SettingsService();
