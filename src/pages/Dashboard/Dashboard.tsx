import { useEffect, useState } from "react";
import { useAlert } from "../../hooks/useAlert";
import { useStore } from "../../hooks/useStore";
import { useWebSocket } from "../../hooks/useWebSocket";
import { AxiosError } from "../../services/apiClient";
import { IFileInfo, IFolder, IUpdate, IUserSearchResult, PLANS } from "../../common/types";
import FileService from "../../services/FileService";
import FolderService from "../../services/FolderService";
import UserService from "../../services/UserService";
import Layout from "../../components/Layout/Layout";
import SmartFolder from "../../components/SmartFolder/SmartFolder";
import NewFolderForm from "../../components/Forms/NewFolderForm/NewFolderForm";
import { fileTypeAllowed, getFileType } from "../../utils/files";
import { capitalizeFirstLetter, truncateFileName } from "../../utils/text";
import styles from "./Dashboard.module.scss";
import StorageWidget from "../../components/Widgets/StorageWidget/StorageWidget";
import FileWidget from "../../components/Widgets/FileWidget/FileWidget";
import RecentWidget from "../../components/Widgets/RecentWidget/RecentWidget";

function Dashboard() {
  const { account, files, folders, settings, storage, initialLoading, loading, uploadFiles, refreshStore } = useStore();
  const { setAlert, clearAlert, setModal, clearModal } = useAlert();
  const [fileteredFiles, setFileteredFiles] = useState<IFileInfo[] | null>(null);
  const [folder, setFolder] = useState<IFolder | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { socket } = useWebSocket();

  useEffect(() => {
    refreshStore();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const update: IUpdate = JSON.parse(event.data);
        console.log(update);
        refreshStore();
      };
    }
  }, [socket, refreshStore]);

  function handleUploadFiles(draggedFiles: File[]) {
    if (!settings) return;
    for (const file of draggedFiles) {
      const type = getFileType(file.type);
      if (!fileTypeAllowed(file, settings)) {
        const typeLabel = capitalizeFirstLetter(type);
        setAlert({ text: `${typeLabel} files is not allowed. Check your settings.` });
        return;
      }
    }
    setAlert({
      text: draggedFiles.length == 1 ? `Are you sure you want to upload "${truncateFileName(draggedFiles[0].name, 25)}" ?` : `Are you sure you want to upload ${draggedFiles.length} files ?`,
      buttonColor: "cancel",
      secondButtonText: "Upload",
      secondButtonColor: "primary",
      onSecondButtonClick: () => {
        clearAlert();
        uploadFiles(draggedFiles, (progress) => setUploadProgress(progress)).finally(() => setUploadProgress(0));
      },
      icon: "upload",
    });
  }

  async function handleSearchFiles(searchTerm: string) {
    if (files.length === 0) return [];
    const { request } = FileService.searchFiles(searchTerm);
    try {
      const response = await request;
      const filteredFiles: IFileInfo[] = response.data;
      return filteredFiles;
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      return [];
    }
  }

  async function handleDeleteFiles(fileNames: string[]) {
    const { request } = FileService.deleteFilesByName(fileNames);
    try {
      await request;
      refreshStore();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    }
  }

  async function handleCreateFolder(folder: IFolder) {
    clearModal();
    const { request } = FolderService.createFolder(folder);
    try {
      await request;
      refreshStore();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    }
  }

  async function handleSearchUsers(query: string) {
    const { request } = UserService.searchUsers(query);
    try {
      const response = await request;
      const users: IUserSearchResult[] = response.data;
      return users;
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      return [];
    }
  }

  function openNewFolderModal() {
    setModal(<NewFolderForm onSubmit={handleCreateFolder} onSearchUsers={handleSearchUsers} onCacnel={clearModal} />);
  }

  function handleFolderGoBack() {
    setFolder(null);
  }

  return (
    <Layout loading={initialLoading} breadcrumbsLoading={loading} text="Loading dashboard...">
      <div className={styles.dashboardBox}>
        {storage && files && settings && account && (
          <>
            <div className={styles.widgetsBox}>
              <StorageWidget storage={storage.totalSize} totalStorage={PLANS[account.plan]!.maxStorageInMb} loading={loading} />
              <FileWidget fileTypeCounts={{ pdf: storage.pdfCount, image: storage.imageCount, audio: storage.audioCount }} loading={loading} />
              <RecentWidget files={files} recentFileNames={storage.lastOpened} loading={loading} />
            </div>
            <div className={styles.smartFolderBox}>
              <SmartFolder
                onFileDrop={handleUploadFiles}
                onCreateFolder={openNewFolderModal}
                onFolderSelect={setFolder}
                onGoBack={handleFolderGoBack}
                files={fileteredFiles ? fileteredFiles : files}
                folders={folders}
                progress={uploadProgress}
                onFilesSearch={handleSearchFiles}
                setFilteredFiles={setFileteredFiles}
                onDeleteFiles={handleDeleteFiles}
                enableSmartSearch={settings.smartSearchEnabled}
                defaultFileView={settings.defaultFileView}
                loading={loading}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
