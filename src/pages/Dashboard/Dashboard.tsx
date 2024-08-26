import { useEffect, useState } from "react";
import { useAlert } from "../../hooks/useAlert";
import { useStore } from "../../hooks/useStore";
import { IFileInfo, IFolder, IUserSearchResult, PLANS } from "../../common/types";
import Layout from "../../components/Layout/Layout";
import SmartFolder from "../../components/SmartFolder/SmartFolder";
import NewFolderForm from "../../components/Forms/NewFolderForm/NewFolderForm";
import { getFileTypeCounts, getFilteredFiles, checkFileTypes } from "../../utils/files";
import { truncateFileName } from "../../utils/text";
import styles from "./Dashboard.module.scss";
import StorageWidget from "../../components/Widgets/StorageWidget/StorageWidget";
import FilesWidget from "../../components/Widgets/FilesWidget/FilesWidget";
import RecentWidget from "../../components/Widgets/RecentWidget/RecentWidget";
import FolderWidget from "../../components/Widgets/FolderWidget/FolderWidget";
import useFileManager from "../../hooks/useFileManager";
import { useNavigate } from "react-router-dom";
import useUserManager from "../../hooks/useUserManager";
import { useAuth } from "../../hooks/useAuth";

function Dashboard() {
  const { account, sharedUsers, files, folders, settings, storage, initialLoading, currentFolder, setCurrentFolder, refreshStore } = useStore();
  const { uploadFiles, deleteFiles, deleteFolders, createFolder, updateFolder, searchFiles, smartSearchFolder, uploadProgress, isLoading } = useFileManager();
  const { searchUsers } = useUserManager();
  const { loadingLogout } = useAuth();
  const { setAlert, clearAlert, setModal, clearModal } = useAlert();
  const navigate = useNavigate();
  const [fileteredFiles, setFileteredFiles] = useState<(IFileInfo | IFolder)[] | null>(null);
  const totalStorage = (account && PLANS[account.plan]?.maxStorageInMb) || 0;
  const isStoreInitialized = storage && files && settings && account && sharedUsers;

  useEffect(() => {
    refreshStore();
  }, []);

  function handleFileClick(file: IFileInfo) {
    navigate(`/dashboard/${file._id}`);
  }

  async function handleSearchFiles(searchTerm: string) {
    return searchFiles(searchTerm, files, folders, currentFolder);
  }

  async function handleFolderSmartSearch(query: string) {
    if (currentFolder == null) return [];
    return smartSearchFolder(currentFolder._id!, query);
  }

  function handleUploadFiles(files: File[]) {
    if (!settings) return;

    if (!checkFileTypes(files, settings)) {
      setAlert({ text: `This type of file is not allowed. Please check your settings.` });
      return;
    }

    setAlert({
      text: `Are you sure you want to upload ${files.length == 1 ? `"${truncateFileName(files[0].name, 25)}"` : `${files.length} files`} ?`,
      buttonColor: "cancel",
      secondButtonText: "Upload",
      secondButtonColor: "primary",
      onSecondButtonClick: () => {
        clearAlert();
        uploadFiles(files);
      },
      icon: "upload",
    });
  }

  function openFolderModal(editFolder?: { folder: IFolder; sharedUsers: IUserSearchResult[]; onUdatedFolder: (folder: IFolder) => void }) {
    const newFolderForm = <NewFolderForm folders={folders} onSubmit={createFolder} onSearchUsers={searchUsers} onCacnel={clearModal} editFolder={editFolder} />;
    setModal(newFolderForm);
  }

  function handleGoBack() {
    setCurrentFolder(null);
  }

  function getFileList() {
    if (fileteredFiles) {
      const files = fileteredFiles.filter((item): item is IFileInfo => "folderId" in item);
      const folders = fileteredFiles.filter((item): item is IFolder => "filesId" in item);
      console.log("filtered Files")
      return getFilteredFiles(files, folders, currentFolder);
    } else {
      return getFilteredFiles(files, folders, currentFolder);
    }
  }

  return (
    <Layout loading={initialLoading || loadingLogout} breadcrumbsLoading={isLoading} breadcrumbsOptions={{ file: null, folder: currentFolder }} text="Loading dashboard...">
      {isStoreInitialized && (
        <div className={styles.dashboardBox}>
          <div className={styles.widgetsBox}>
            {currentFolder && sharedUsers && (
              <FolderWidget
                folder={currentFolder}
                totalStorage={totalStorage}
                loading={isLoading}
                sharedUsers={sharedUsers}
                isMyFolder={currentFolder.userId === account._id}
                onEditClick={() => openFolderModal({ folder: currentFolder, sharedUsers, onUdatedFolder: updateFolder })}
              />
            )}
            <StorageWidget storage={storage.totalSize} totalStorage={totalStorage} loading={isLoading} />
            <FilesWidget fileTypeCounts={getFileTypeCounts(storage, files, currentFolder)} loading={isLoading} />
            <RecentWidget files={files} recentFileNames={storage.lastOpened} loading={isLoading} />
          </div>
          <div className={styles.smartFolderBox}>
            <SmartFolder
              onUploadFiles={handleUploadFiles}
              onCreateFolder={() => openFolderModal()}
              onFolderClick={setCurrentFolder}
              onFileClick={handleFileClick}
              onGoBack={handleGoBack}
              files={getFileList()}
              folders={folders}
              progress={uploadProgress}
              currentFolder={currentFolder}
              smartSearch={!!currentFolder && !!settings.smartSearchEnabled}
              setCurrentFolder={setCurrentFolder}
              onSearchFiles={handleSearchFiles}
              onSmartSearchFiles={handleFolderSmartSearch}
              setFilteredFiles={setFileteredFiles}
              onDeleteFiles={deleteFiles}
              onDeleteFolders={deleteFolders}
              defaultFileView={settings.defaultFileView}
              loading={isLoading}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Dashboard;
