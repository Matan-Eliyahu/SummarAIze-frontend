import { fileIconMap } from "../../../common/icons";
import { FileStatus, IFile } from "../../../common/types";
import { FaBell, FaTriangleExclamation } from "react-icons/fa6";
import styles from "./FileItem.module.scss";
import Spinner from "../../Spinner/Spinner";
import { FileListView } from "../Toolbar/Toolbar";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { truncateFileName } from "../../../utils/text";

interface FileItemProps {
  file: IFile;
  listView: FileListView;
}

export default function FileItem({ file, listView }: FileItemProps) {
  const navigate = useNavigate();
  function iconSwitch(file: IFile) {
    const iconSrc = fileIconMap[file.type];
    return <img className={listView === "icons" ? styles.fileIcon : styles.fileListIcon} src={iconSrc} alt="file icon" />;
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

  function handleFileClick() {
    navigate(`/dashboard/${file.name}`);
  }

  if (listView === "icons")
    return (
      <button className={styles.fileItemBox} onClick={handleFileClick} data-file-name={file.name}>
        <div className={styles.fileStatusBox}>{statusIconSwitch(file.status)}</div>
        {iconSwitch(file)}
        <div className={styles.fileNameText}>{truncateFileName(file.name)}</div>
      </button>
    );

  return (
    <div className={listView === "recent" ? styles.recentListBox : styles.fileListBox} data-file-name={file.name} onClick={handleFileClick}>
      {listView !== "recent" && (
        <>
          <div className={styles.fileListStatusBox}>{statusIconSwitch(file.status)}</div>
          <div className={styles.seperator} />
        </>
      )}
      {iconSwitch(file)}
      <div className={styles.seperator} />
      <div className={styles.fileListNameText}>{listView === "list" ? file.name : truncateFileName(file.name, 23)}</div>
      {listView !== "recent" && (
        <>
          <div className={styles.seperator} />
          <div className={styles.fileSizeText}>{`${file.size} MB`}</div>
          <div className={styles.seperator} />
          <div className={styles.fileSizeText}>{moment(file.uploadedAt).format("DD/MM/YYYY HH:mm:ss")}</div>
        </>
      )}
    </div>
  );
}
