import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class UploadService {
  private path = "/upload";

  uploadFiles(files: File[], onProgress: (progress: number) => void, folderId?: string) {
    const controller = new AbortController();
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const request = apiClient.post(`${this.path}/files`, formData, {
      signal: controller.signal,
      params: { folderId },
      onUploadProgress: (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / (event.total ?? event.loaded)) * 100);
          onProgress(percent);
        } else {
          // Handle case where event.lengthComputable is false
          onProgress(0); // or handle as needed
        }
      },
    });

    return { request, cancel: () => controller.abort() };
  }

  uploadProfilePicture(image: File) {
    const controller = new AbortController();
    const formData = new FormData();
    formData.append("profile-picture", image);
    const request = apiClient.post<{ imageUrl: string }>(`${this.path}/profile-picture`, formData, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }
}

export default new UploadService();
