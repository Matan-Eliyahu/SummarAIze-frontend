import { useEffect, useState } from "react";
import { useError } from "../../hooks/useError";
import { AxiosError } from "../../services/SummaryService";
import Layout from "../../components/Layout/Layout";
import DragDrop from "../../components/DragDrop/DragDrop";
import styles from "./Dashboard.module.scss";
import UploadService from "../../services/UploadService";
import FileService from "../../services/FileService";
import { IFile, ISettings, IStorage } from "../../common/types";
import SettingsService from "../../services/SettingsService";
import { getFileType } from "../../utils/files";
import { capitalizeFirstLetter } from "../../utils/text";
import StorageService from "../../services/StorageService";
import TotalSizeProgressBar from "../../components/TotalSizeProgressBar/TotalSizeProgressBar";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart";

function Dashboard() {
  const { setAlert, clearAlert } = useError();
  const [userFiles, setUserFiles] = useState<IFile[] | null>(null);
  const [userSettings, setUserSettings] = useState<ISettings | null>(null);
  const [userStorage, setUserStorage] = useState<IStorage | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // async function fetchUserFiles() {
  //   const { request } = FileService.getUserFiles();
  //   setLoading(true);
  //   try {
  //     const response = await request;
  //     const userFiles: IFile[] = response.data;
  //     setUserFiles(userFiles);
  //     console.log(userFiles);
  //   } catch (error) {
  //     if (error instanceof AxiosError) setAlert({ error });
  //     console.log("Get files error: ", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // async function fetchUserSettings() {
  //   const { request } = SettingsService.getSettingsByUserId();
  //   setLoading(true);
  //   try {
  //     const response = await request;
  //     const userSettings: ISettings = response.data;
  //     setUserSettings(userSettings);
  //   } catch (error) {
  //     if (error instanceof AxiosError) setAlert({ error });
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function fetchUserData() {
    setLoading(true);
    try {
      const [filesResponse, settingsResponse, storageResponse] = await Promise.all([
        FileService.getUserFiles().request,
        SettingsService.getSettingsByUserId().request,
        StorageService.getUserStorage().request,
      ]);

      const userFiles: IFile[] = filesResponse.data;
      const userSettings: ISettings = settingsResponse.data;
      const userStorage: IStorage = storageResponse.data;

      setUserFiles(userFiles);
      setUserSettings(userSettings);
      setUserStorage(userStorage);

      console.log("User storage:", userStorage);
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      console.error("Error fetching user data: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  async function uploadFiles(files: File[]) {
    const { request } = UploadService.uploadFiles(files, (progress) => setUploadProgress(progress));
    try {
      await request;
      await fetchUserData();
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      console.log("Upload error: ", error);
    } finally {
      setUploadProgress(0);
    }
  }

  function handleUploadFiles(files: File[]) {
    if (!userSettings) return;
    for (const file of files) {
      const type = getFileType(file.type);
      if (!userSettings.allowedFileTypes.includes(type)) {
        setAlert({ text: `${capitalizeFirstLetter(type)} files is not allowed. Check your settings.` });
        return;
      }
    }
    setAlert({
      text: files.length == 1 ? `Are you sure you want to upload "${files[0].name}" ?` : `Are you sure you want to upload ${files.length} files ?`,
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

  return (
    <Layout loading={loading} text="Loading dashboard...">
      <div className={styles.dashboardBox}>
        {userStorage && (
          <div className={styles.infoBox}>
            <TotalSizeProgressBar totalSize={userStorage.totalSize} maxSize={500} />
            <DoughnutChart fileTypeCounts={{ pdf: userStorage.pdfCount, image: userStorage.imageCount, audio: userStorage.audioCount }} />
          </div>
        )}
        {userFiles && (
          <div className={styles.dragDropBox}>
            <DragDrop onFileDrop={handleUploadFiles} files={userFiles} progress={uploadProgress} />
          </div>
        )}
      </div>
      {/* <Button theme="primary" children={<img className={styles.sumBtnImg} src={logo} alt="logo" />} onClick={handleSummarize}></Button> */}
    </Layout>
  );
}

export default Dashboard;
