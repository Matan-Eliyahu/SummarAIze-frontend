import { fileIconMap } from "../../../common/icons";
import { FileStatus, IFile } from "../../../common/types";
import { FaBell, FaTriangleExclamation } from "react-icons/fa6";
import styles from "./FileItem.module.scss";
import Spinner from "../../Spinner/Spinner";
import { FileListView } from "../Toolbar/Toolbar";
import moment from "moment";
import UploadsService from "../../../services/UploadsService";
import FileService from "../../../services/FileService";

interface FileItemProps {
  file: IFile;
  listView: FileListView;
}

export default function FileItem({ file, listView }: FileItemProps) {
  function iconSwitch(file: IFile) {
    const iconSrc = fileIconMap[file.type];
    return <img className={listView === "icons" ? styles.fileIcon : styles.fileListIcon} src={iconSrc} alt="file icon" />;
  }

  function truncateFileName(name: string, maxLength: number = 15) {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
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

  async function handleFileClick() {
    const { request } = UploadsService.getStaticFileByPath(file.path);
    try {
      const response = await request;
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.path; // Set the download attribute with the filename
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error(error);
    }
  }

  async function handleFileClick2() {
    const { request } = FileService.getFileByName(file.name);
    try {
      await request;
    } catch (error) {
      console.error(error);
    }
  }

  if (listView === "icons")
    return (
      <button className={styles.fileItemBox} onClick={handleFileClick2} data-file-name={file.name}>
        <div className={styles.fileStatusBox}>{statusIconSwitch(file.status)}</div>
        {iconSwitch(file)}
        <div className={styles.fileNameText}>{truncateFileName(file.name)}</div>
      </button>
    );

  return (
    <div className={styles.fileListBox} data-file-name={file.name}>
      <div className={styles.fileListStatusBox}>{statusIconSwitch(file.status)}</div>
      <div className={styles.seperator} />
      {iconSwitch(file)}
      <div className={styles.seperator} />
      <div className={styles.fileListNameText}>{file.name}</div>
      <div className={styles.seperator} />
      <div className={styles.fileSizeText}>{`${file.size} MB`}</div>
      <div className={styles.seperator} />
      <div className={styles.fileSizeText}>{moment(file.uploadedAt).format("DD/MM/YYYY HH:mm:ss")}</div>
    </div>
  );
}
