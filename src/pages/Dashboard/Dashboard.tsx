import { useEffect, useState } from "react";
import { useError } from "../../hooks/useError";
import Layout from "../../components/Layout/Layout";
import DragDrop from "../../components/DragDrop/DragDrop";
import styles from "./Dashboard.module.scss";
import { getFileType } from "../../utils/files";
import { capitalizeFirstLetter } from "../../utils/text";
import TotalSizeProgressBar from "../../components/TotalSizeProgressBar/TotalSizeProgressBar";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart";
import { useStore } from "../../hooks/useStore";
import useWebSocket from "../../hooks/useWebSocket";
import { AxiosError } from "../../services/apiClient";
import { IFile, IUpdate } from "../../common/types";
import RecentFilesList from "../../components/RecentFilesList/RecentFilesList";
import FileService from "../../services/FileService";

function Dashboard() {
  const { files, settings, storage, initialLoading, uploadFiles, refreshStore } = useStore();
  const { setAlert, clearAlert } = useError();
  const [fileteredFiles, setFileteredFiles] = useState<IFile[] | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const socket = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const update: IUpdate = JSON.parse(event.data);
        console.log(update);
        refreshStore();
      };
    }
  }, [socket, refreshStore]);

  useEffect(() => {
    refreshStore();
  }, []);

  function handleUploadFiles(draggedFiles: File[]) {
    if (!settings) return;
    for (const file of draggedFiles) {
      const type = getFileType(file.type);
      if (!settings.allowedFileTypes.includes(type)) {
        setAlert({ text: `${capitalizeFirstLetter(type)} files is not allowed. Check your settings.` });
        return;
      }
    }
    setAlert({
      text: draggedFiles.length == 1 ? `Are you sure you want to upload "${draggedFiles[0].name}" ?` : `Are you sure you want to upload ${draggedFiles.length} files ?`,
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
    const { request } = FileService.searchFiles(searchTerm);
    try {
      const response = await request;
      const filteredFiles: IFile[] = response.data;
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

  return (
    <Layout loading={initialLoading} text="Loading dashboard...">
      <div className={styles.dashboardBox}>
        <div className={styles.infoBox}>
          <TotalSizeProgressBar totalSize={storage?.totalSize ?? 0} maxSize={500} loading={!storage} />
          <DoughnutChart fileTypeCounts={{ pdf: storage?.pdfCount ?? 0, image: storage?.imageCount ?? 0, audio: storage?.audioCount ?? 0 }} loading={!storage} />
          <RecentFilesList files={files ?? []} recentFileNames={storage?.lastOpened ?? []} loading={!storage} />
        </div>

        {files && (
          <div className={styles.dragDropContainer}>
            <div className={styles.dragDropBox}>
              <DragDrop
                onFileDrop={handleUploadFiles}
                files={fileteredFiles ? fileteredFiles : files}
                progress={uploadProgress}
                searchFiles={handleSearchFiles}
                setFilteredFiles={setFileteredFiles}
                onDeleteFiles={handleDeleteFiles}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
