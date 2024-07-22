import { useCallback } from "react";
import UploadsService from "../services/UploadsService";

export const useDownloadFile = () => {
  const downloadFile = useCallback(async (filePath: string) => {
    try {
      const { request } = UploadsService.getStaticFileByPath(filePath);
      const response = await request;

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filePath; // Set the download attribute with the filename
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("Error downloading file:", error);
      // You can also implement more sophisticated error handling here (e.g., show a notification to the user)
    }
  }, []);

  return { downloadFile };
};
