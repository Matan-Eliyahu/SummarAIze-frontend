import React, { createContext, useEffect, useState, ReactNode } from "react";
import { AxiosError } from "axios";
import { IAccount, IFileInfo, IFolder, ISettings, IStorage, IUserSearchResult } from "../common/types";
import FileService from "../services/FileService";
import SettingsService from "../services/SettingsService";
import StorageService from "../services/StorageService";
import { useAlert } from "../hooks/useAlert";
import UserService from "../services/UserService";
import FolderService from "../services/FolderService";

interface StoreContextProps {
  account: IAccount | null;
  files: IFileInfo[];
  folders: IFolder[];
  settings: ISettings | null;
  storage: IStorage | null;
  sharedUsers: IUserSearchResult[] | null;
  initialLoading: boolean;
  loading: boolean;
  refreshStore: () => Promise<void>;
  currentFolder: IFolder | null;
  setCurrentFolder: React.Dispatch<React.SetStateAction<IFolder | null>>;
}

export const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setAlert } = useAlert();
  const [account, setAccount] = useState<IAccount | null>(null);
  const [files, setFiles] = useState<IFileInfo[]>([]);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [storage, setStorage] = useState<IStorage | null>(null);
  const [sharedUsers, setSharedUsers] = useState<IUserSearchResult[] | null>(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<IFolder | null>(null);

  useEffect(() => {
    console.log("CURRENT FOLDER: ", currentFolder);
  }, [currentFolder]);

  async function fetchUserData(isInitialLoad = false) {
    if (isInitialLoad) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const filesResponse = await FileService.getUserFiles().request;
      const foldersResponse = await FolderService.getUserFolders().request;
      const accountResponse = await UserService.getUser().request;
      const storageResponse = await StorageService.getUserStorage().request;
      const settingsResponse = await SettingsService.getSettingsByUserId().request;
      const sharedUsersResponse = await UserService.getSharedFolderUsers().request;

      setFiles(filesResponse.data);
      setFolders(foldersResponse.data);
      setAccount(accountResponse.data);
      setStorage(storageResponse.data);
      setSettings(settingsResponse.data);
      setSharedUsers(sharedUsersResponse.data);
      if (currentFolder != null) {
        console.log("Fetching current folder...");
        const folderRequest = await FolderService.getFolderById(currentFolder._id!).request;
        setCurrentFolder(folderRequest.data);
      }
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

  useEffect(() => {
    fetchUserData(true);
  }, []);

  async function refreshStore() {
    console.log("**** refresh store ****");
    await fetchUserData();
  }

  return (
    <StoreContext.Provider value={{ account, files, folders, settings, sharedUsers, storage, initialLoading, loading, refreshStore, currentFolder, setCurrentFolder }}>
      {children}
    </StoreContext.Provider>
  );
};
