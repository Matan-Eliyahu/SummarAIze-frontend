import { fileIconMap } from "../../../common/icons";
import { FileStatus, IFile } from "../../../common/types";
import { FaBell, FaBox, FaCircle, FaCircleCheck, FaRegCalendar, FaTriangleExclamation } from "react-icons/fa6";
import styles from "./FileItem.module.scss";
import Spinner from "../../Spinner/Spinner";
import { FileListView } from "../../../common/types";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

interface FileItemProps {
  file: IFile;
  listView: FileListView;
  isSelected: boolean;
  onLongPress: (fileName: string) => void;
  onSelectToggle: (fileName: string) => void;
  isSelectionMode: boolean;
}

export default function FileItem({ file, listView, isSelected, onLongPress, onSelectToggle, isSelectionMode }: FileItemProps) {
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const [clickDelayed, setClickDelayed] = useState<boolean>(false);

  function iconSwitch(file: IFile) {
    const iconSrc = fileIconMap[file.type];
    return <img className={listView === "icons" ? styles.fileIcon : styles.fileListIcon} src={iconSrc} alt="file icon" draggable={false} onDragStart={handleDragStart} />;
  }

  function statusIconSwitch(status: FileStatus) {
    if (isSelectionMode) {
      switch (isSelected) {
        case true:
          return <FaCircleCheck className={styles.selectIcon} />;
        case false:
          return <FaCircle className={styles.selectIcon} />;
      }
    } else {
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
  }

  function handleFileClick() {
    if (clickDelayed) {
      setClickDelayed(false);
      return; // Prevent the click action
    }
    if (isSelectionMode) {
      console.log(isSelectionMode);
      onSelectToggle(file.name);
    } else {
      navigate(`/dashboard/${file.name}`);
    }
  }

  function handleMouseDown() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      onLongPress(file.name);
      setClickDelayed(true); // Set clickDelayed to true when long press is detected
    }, 300); // Long press duration
  }

  function handleMouseUp() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
  }

  function handleDragStart(event: React.DragEvent<HTMLImageElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement|HTMLButtonElement>) {
    event.stopPropagation();
  }

  if (listView === "icons")
    return (
      <button
        className={isSelected ? styles.fileItemBoxSelected : styles.fileItemBox}
        onClick={handleFileClick}
        data-file-name={file.name}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onDragOver={handleDragOver}
      >
        <div className={styles.fileStatusBox}>{statusIconSwitch(file.status)}</div>
        {iconSwitch(file)}
        <div className={styles.fileNameText}>{file.name}</div>
      </button>
    );

  return (
    <div
      className={listView === "recent" ? styles.recentListBox : isSelected ? styles.fileListBoxSelected : styles.fileListBox}
      data-file-name={file.name}
      onClick={handleFileClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
    >
      {listView !== "recent" && (
        <>
          <div className={styles.fileListStatusBox}>{statusIconSwitch(file.status)}</div>
          <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
        </>
      )}
      {iconSwitch(file)}
      <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
      <div className={listView === "recent" ? styles.fileRecentNameText:styles.fileListNameText}>{file.name}</div>
      {listView !== "recent" && (
        <>
          <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
          <div className={styles.fileSizeText}>
            <FaBox className={styles.fileListIcon} />
            {`${file.size} MB`}
          </div>
          <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
          <div className={styles.fileSizeText}>
            <FaRegCalendar className={styles.fileListIcon} />
            {moment(file.uploadedAt).format("DD/MM/YYYY HH:mm:ss")}
          </div>
        </>
      )}
    </div>
  );
}
