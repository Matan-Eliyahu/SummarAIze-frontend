import Layout from "../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { FileStatus, IFile } from "../../common/types";
import { fileIconMap } from "../../common/icons";
import styles from "./File.module.scss";
import { useParams } from "react-router-dom";
import FileService, { AxiosError } from "../../services/FileService";
import { useError } from "../../hooks/useError";
import { FaBell, FaBoxOpen, FaFileArrowDown, FaTriangleExclamation, FaUpload } from "react-icons/fa6";
import moment from "moment";
import Spinner from "../../components/Spinner/Spinner";
import { truncateFileName } from "../../utils/text";
import { useDownloadFile } from "../../hooks/useDownloadFile";

export default function File() {
  const { setAlert } = useError();
  const { fileName } = useParams<{ fileName: string }>();
  const { downloadFile } = useDownloadFile();
  const [file, setFile] = useState<IFile | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchFileData() {
    if (!fileName) {
      setAlert({ text: "No file name" });
      return;
    }
    const { request } = FileService.getFileByName(fileName);
    setLoading(true);
    try {
      const respose = await request;
      const file: IFile = respose.data;
      setFile(file);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function statusIconSwitch(status: FileStatus) {
    switch (status) {
      case "processing":
        return <Spinner size="s" />;
      case "completed":
        return <div className={styles.summarizedIcon} />;
      case "unprocessed":
        return <FaBell className={styles.unprocessedIcon} />;
      case "error":
        return <FaTriangleExclamation className={styles.errorIcon} />;
    }
  }

  useEffect(() => {
    fetchFileData();
  }, []);

  async function handleDownloadFile() {
    if (!file) return;
    try {
      await downloadFile(file.path);
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    }
  }

  return (
    <Layout loading={loading}>
      {file && (
        <>
          <div className={styles.fileContainer}>
            <div className={styles.infoBox}>
              <div className={styles.titleBox}>
                <img className={styles.fileTitleIcon} src={fileIconMap[file.type]} alt="file-image" />
                {truncateFileName(file.name, 24)}
              </div>
              <div className={styles.titleBox}>
                {statusIconSwitch(file.status)}
                {file.status}
              </div>
              <div className={styles.titleBox}>
                <FaUpload className={styles.fileTitleIcon} />
                {moment(file.uploadedAt).format("DD/MM/YYYY HH:mm:ss")}
              </div>
              <div className={styles.titleBox}>
                <FaBoxOpen className={styles.fileTitleIcon} />
                {`${file.size} MB`}
              </div>
              <button className={styles.downloadButton} onClick={handleDownloadFile}>
                <FaFileArrowDown className={styles.downloadButtonIcon} />
                Download file
              </button>
            </div>
            <div className={styles.contentBox}></div>
          </div>
        </>
      )}
    </Layout>
  );
}
