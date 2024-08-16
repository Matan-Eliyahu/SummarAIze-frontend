import React, { createContext, useEffect, useState, ReactNode } from "react";
import { AxiosError } from "axios";
import { IAccount, IFileInfo, IFolder, ISettings, IStorage, IUser, PlanType } from "../common/types";
import FileService from "../services/FileService";
import SettingsService from "../services/SettingsService";
import StorageService from "../services/StorageService";
import UploadService from "../services/UploadService";
import { useAlert } from "../hooks/useAlert";
import UserService from "../services/UserService";
import FolderService from "../services/FolderService";

interface StoreContextProps {
  account: IAccount | null;
  files: IFileInfo[];
  folders: IFolder[];
  settings: ISettings | null;
  storage: IStorage | null;
  initialLoading: boolean;
  loading: boolean;
  uploadFiles: (files: File[], progressHandler: (progress: number) => void) => Promise<void>;
  refreshStore: () => Promise<void>;
  updateUser: (updatedUser: IUser) => Promise<void>;
  updateUserPlan: (newPlan: PlanType) => Promise<void>;
}

export const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setAlert } = useAlert();
  const [account, setAccount] = useState<IAccount | null>(null);
  const [files, setFiles] = useState<IFileInfo[]>([]);
  const [folders, setFolders] = useState<IFolder[]>([]);
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
      const accountResponse = await UserService.getUser().request;
      const filesResponse = await FileService.getUserFiles().request;
      const foldersResponse = await FolderService.getUserFolders().request;
      const storageResponse = await StorageService.getUserStorage().request;
      const settingsResponse = await SettingsService.getSettingsByUserId().request;

      setAccount(accountResponse.data);
      setFiles(filesResponse.data);
      setFolders(foldersResponse.data);
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

  async function updateUser(updatedUser: IUser) {
    setLoading(true);
    try {
      const { request } = UserService.updateUser(updatedUser);
      await request;
      await fetchUserData();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setLoading(false);
    }
  }

  async function updateUserPlan(newPlan: PlanType) {
    setLoading(true);
    try {
      const { request } = UserService.updateUserPlan(newPlan);
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

  async function refreshStore() {
    await fetchUserData();
  }

  return (
    <StoreContext.Provider value={{ account, files, folders, settings, storage, initialLoading, loading, uploadFiles, refreshStore, updateUser, updateUserPlan }}>{children}</StoreContext.Provider>
  );
};
