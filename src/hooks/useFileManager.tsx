import { useState } from "react";
import FileService, { AxiosError } from "../services/FileService";
import FolderService from "../services/FolderService";
import { IFile, IFileInfo, IFolder, ISummaryOptions } from "../common/types";
import UploadService from "../services/UploadService";
import { useAlert } from "./useAlert";
import { useStore } from "./useStore";
import SummaryService from "../services/SummaryService";

export default function useFileManager() {
  const { setAlert } = useAlert();
  const { currentFolder, setCurrentFolder, refreshStore } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateFileloading, setUpdateFileLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  async function getFile(fileId: string) {
    const { request } = FileService.getFileById(fileId);
    setIsLoading(true);
    try {
      const respose = await request;
      const file: IFile = respose.data;
      return file;
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function uploadFiles(files: File[]) {
    setIsLoading(true);
    const folderId = currentFolder?._id;
    const uploadRequest = UploadService.uploadFiles(files, (progress) => setUploadProgress(progress), folderId).request;
    try {
      await uploadRequest;
      await refreshStore();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setUploadProgress(0);
      setIsLoading(false);
    }
  }

  async function searchFiles(searchTerm: string, files: IFileInfo[], folders: IFolder[], currentFolder: IFolder | null) {
    if (files.length === 0 || folders.length === 0) return [];

    try {
      if (currentFolder === null) {
        // Perform the search across all files and folders
        const [filesRes, foldersRes] = await Promise.all([FileService.searchFiles(searchTerm).request, FolderService.searchFolders(searchTerm).request]);
        const results: (IFileInfo | IFolder)[] = [...filesRes.data, ...foldersRes.data];
        return results;
      } else {
        // Perform the search within the files and filter by folderId
        const filesRes = await FileService.searchFiles(searchTerm).request;
        const filteredFiles = filesRes.data.filter((file: IFileInfo) => file.folderId === currentFolder._id);
        return filteredFiles;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setAlert({ error });
      }
      return [];
    }
  }

  async function smartSearchFolder(folderId: string, query: string) {
    try {
      const resposne = await FolderService.smartSearch(folderId, query).request;
      const results: IFile[] = resposne.data;
      return results;
    } catch (error) {
      if (error instanceof AxiosError) {
        setAlert({ error });
      }
      return [];
    }
  }

  async function deleteFile(fileId: string) {
    const { request } = FileService.deleteFileById(fileId);
    setIsLoading(true);
    try {
      await request;
      return true;
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteFiles(filesId: string[]) {
    setIsLoading(true);
    try {
      const request = filesId.length === 1 ? FileService.deleteFileById(filesId[0]).request : FileService.deleteMultipleFilesById(filesId).request;
      await request;
      await refreshStore();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteFolders(foldersId: string[]) {
    setIsLoading(true);
    try {
      const request = foldersId.length === 1 ? FolderService.deleteFolderById(foldersId[0]).request : FolderService.deleteMultipleFoldersById(foldersId).request;
      await request;
      if (currentFolder && foldersId.some((id) => id == currentFolder._id)) setCurrentFolder(null);
      await refreshStore();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setIsLoading(false);
    }
  }

  async function createFolder(folder: IFolder) {
    const { name, isPrivate, sharedWith } = folder;

    if (name === "" || (!isPrivate && sharedWith.length === 0)) return;

    setIsLoading(true);
    try {
      await FolderService.createFolder(folder).request;
      await refreshStore();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setIsLoading(false);
    }
  }

  async function updateFolder(folder: IFolder) {
    setIsLoading(true);
    try {
      const request = FolderService.updateFolderById(folder).request;
      await request;
      await refreshStore();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setIsLoading(false);
    }
  }

  async function updateFileText(fileId: string, updatedTranscribe: string, updatedSummary: string) {
    const { request } = FileService.updateFileById(fileId, updatedTranscribe, updatedSummary);
    setUpdateFileLoading(true);
    try {
      const response = await request;
      const updatedFile: IFile = response.data;
      return updatedFile;
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      return null;
    } finally {
      setUpdateFileLoading(false);
    }
  }

  async function summarizeFile(fileId: string, summaryOptions: ISummaryOptions) {
    const { request } = SummaryService.summarize(fileId, summaryOptions);
    setUpdateFileLoading(true);
    try {
      await request;
      return true;
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      return false;
    } finally {
      setUpdateFileLoading(false);
    }
  }

  return {
    isLoading,
    updateFileloading,
    uploadProgress,
    getFile,
    updateFileText,
    summarizeFile,
    uploadFiles,
    searchFiles,
    smartSearchFolder,
    deleteFile,
    deleteFiles,
    deleteFolders,
    createFolder,
    updateFolder,
  };
}
