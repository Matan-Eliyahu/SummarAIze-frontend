import React, { createContext, useEffect, useState, ReactNode } from "react";
import { AxiosError } from "axios";
import { IFile, ISettings, IStorage } from "../common/types";
import FileService from "../services/FileService";
import SettingsService from "../services/SettingsService";
import StorageService from "../services/StorageService";
import UploadService from "../services/UploadService";
import { useError } from "../hooks/useError";

interface StoreContextProps {
  files: IFile[];
  settings: ISettings | null;
  storage: IStorage | null;
  initialLoading: boolean;
  loading: boolean;
  uploadFiles: (files: File[], progressHandler: (progress: number) => void) => Promise<void>;
  refreshStore: () => void;
}

export const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setAlert } = useError();
  const [files, setFiles] = useState<IFile[]>([]);
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [storage, setStorage] = useState<IStorage | null>(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchUserData(isInitialLoad = false) {
    if (isInitialLoad) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const filesResponse = await FileService.getUserFiles().request;
      const storageResponse = await StorageService.getUserStorage().request;
      const settingsResponse = await SettingsService.getSettingsByUserId().request;

      setFiles(filesResponse.data);
      setStorage(storageResponse.data);
      setSettings(settingsResponse.data);
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      if (isInitialLoad) {
        setInitialLoading(false);
      } else {
        setLoading(false);
      }
    }
  }

  async function uploadFiles(files: File[], progressHandler: (progress: number) => void) {
    const { request } = UploadService.uploadFiles(files, progressHandler);
    setLoading(true);
    try {
      await request;
      await fetchUserData();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserData(true);
  }, []);

  function refreshStore() {
    fetchUserData();
  }

  return (
    <StoreContext.Provider value={{ files, settings, storage, initialLoading, loading, uploadFiles, refreshStore }}>
      {children}
    </StoreContext.Provider>
  );
};
