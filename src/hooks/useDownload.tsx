import { useCallback } from "react";
import UploadsService from "../services/UploadsService";

export function useDownload() {
  const downloadFile = useCallback(async (filePath: string) => {
    try {
      const { request } = UploadsService.getStaticFileByPath(filePath);
      const response = await request;

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filePath;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }, []);

  return downloadFile;
}
