import apiClient, { CanceledError, AxiosError } from "./apiClient";
export { CanceledError, AxiosError };

class UploadService {
  private path = "/upload";

  uploadFiles(files: File[], onProgress: (progress: number) => void) {
    const controller = new AbortController();
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const request = apiClient.post(this.path, formData, {
      signal: controller.signal,
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
}

export default new UploadService();
