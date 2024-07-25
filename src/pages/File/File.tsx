import Layout from "../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { FileStatus, IFile, IUpdate } from "../../common/types";
import { fileIconMap } from "../../common/icons";
import styles from "./File.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import FileService, { AxiosError } from "../../services/FileService";
import { useError } from "../../hooks/useError";
import { FaBell, FaBoxOpen, FaFileArrowDown, FaTrash, FaTriangleExclamation, FaUpload } from "react-icons/fa6";
import moment from "moment";
import Spinner from "../../components/Spinner/Spinner";
import { capitalizeFirstLetter, truncateFileName } from "../../utils/text";
import { useDownloadFile } from "../../hooks/useDownloadFile";
import useWebSocket from "../../hooks/useWebSocket";
import SummaryDisplay from "../../components/SummaryDisplay/SummaryDisplay";

export default function File() {
  const { setAlert, clearAlert } = useError();
  const { fileName } = useParams<{ fileName: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<IFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [updateFileloading, setUpdateFileLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const socket = useWebSocket();
  const download = useDownloadFile();

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const update: IUpdate = JSON.parse(event.data);
        console.log(update);
        fetchFileData();
      };
    }
  }, [socket]);

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
      case "not-summarized":
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
      await download(file.path);
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    }
  }

  async function deleteFile() {
    if (!file || !fileName) return;
    const { request } = FileService.deleteFileByName(fileName);
    setLoading(true);
    try {
      await request;
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      setLoading(false);
    }
  }

  function handleDeleteFile() {
    if (!file) return;
    if (file.status === "processing") {
      setAlert({
        text: "Please wait for the file to finish processing",
      });
    } else
      setAlert({
        text: `Are you sure you want to permanently delete ${fileName} ?`,
        secondButtonText: "Delete",
        secondButtonColor: "danger",
        onSecondButtonClick: () => {
          clearAlert();
          deleteFile();
        },
      });
  }

  async function handleUpdateFileText(updatedTranscribe: string, updatedSummary: string) {
    if (!file) return;
    const { request } = FileService.updateFileByName(file.name, updatedTranscribe, updatedSummary);
    setUpdateFileLoading(true);
    try {
      const response = await request;
      const newFile: IFile = response.data;
      setFile(newFile);
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setUpdateFileLoading(false);
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
                {file.name && truncateFileName(file.name, 24)}
              </div>
              <div className={styles.smallTextTitleBox}>
                {statusIconSwitch(file.status)}
                {file.status && capitalizeFirstLetter(file.status)}
              </div>
              <div className={styles.smallTextTitleBox}>
                <FaUpload className={styles.fileTitleIcon} />
                {moment(file.uploadedAt).format("DD/MM/YYYY HH:mm:ss")}
              </div>
              <div className={styles.smallTextTitleBox}>
                <FaBoxOpen className={styles.fileTitleIcon} />
                {`${file.size} MB`}
              </div>
              <button className={styles.downloadButton} onClick={handleDownloadFile}>
                <FaFileArrowDown className={styles.downloadButtonIcon} />
                Download file
              </button>
              {edit && (
                <button className={styles.deleteButton} onClick={handleDeleteFile}>
                  <FaTrash className={styles.deleteButtonIcon} />
                  Delete file
                </button>
              )}
            </div>
            <div className={styles.contentBox}>
              <SummaryDisplay
                edit={edit}
                setEdit={setEdit}
                transcribe={file.transcribe}
                summary={file.summary}
                onSave={handleUpdateFileText}
                loading={updateFileloading || file.status === "processing"}
              />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
