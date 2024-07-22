import React, { createContext, useEffect, useState, ReactNode } from "react";
import { AxiosError } from "axios";
import { IFile, ISettings, IStorage } from "../common/types";
import FileService from "../services/FileService";
import SettingsService from "../services/SettingsService";
import StorageService from "../services/StorageService";
import UploadService from "../services/UploadService";
import { useError } from "../hooks/useError";
import { useAuth } from "../hooks/useAuth";

interface StoreContextProps {
  files: IFile[];
  settings: ISettings | null;
  storage: IStorage | null;
  initialLoading: boolean;
  uploadFiles: (files: File[], progressHandler: (progress: number) => void) => Promise<void>;
  refreshStore: () => void;
}

export const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setAlert } = useError();
  const { auth } = useAuth();
  const [files, setFiles] = useState<IFile[]>([]);
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [storage, setStorage] = useState<IStorage | null>(null);
  const [initialLoading, setInitialLoading] = useState(false);

  async function fetchUserData() {
    try {
      const filesResponse = await FileService.getUserFiles().request;
      const storageResponse = await StorageService.getUserStorage().request;
      const settingsResponse = await SettingsService.getSettingsByUserId().request;

      setFiles(filesResponse.data);
      setStorage(storageResponse.data);
      setSettings(settingsResponse.data);
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    }
  }

  async function uploadFiles(files: File[], progressHandler: (progress: number) => void) {
    if (!auth) return;
    const { request } = UploadService.uploadFiles(files, progressHandler);
    try {
      await request;
      await fetchUserData();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    }
  }

  useEffect(() => {
    if (auth) {
      const isInitialized = !!files && !!settings && !!storage;
      if (!isInitialized) setInitialLoading(true);
      fetchUserData();
      setInitialLoading(false);
    }
  }, [auth]);

  function refreshStore() {
    fetchUserData();
  }

  return <StoreContext.Provider value={{ files, settings, storage, initialLoading, uploadFiles, refreshStore }}>{children}</StoreContext.Provider>;
};
