import { fileIconMap } from "../../../common/icons";
import { IFileInfo } from "../../../common/types";
import { FaBox, FaRegCalendar } from "react-icons/fa6";
import styles from "./FileItem.module.scss";
import { FileListView } from "../../../common/types";
import moment from "moment";
import { useRef, useState } from "react";
import { statusIconSwitch } from "./iconUtils";

interface FileItemProps {
  file: IFileInfo;
  listView: FileListView;
  isSelected: boolean;
  onClick:(file:IFileInfo)=>void;
  onLongPress: (fileName: string) => void;
  onSelectToggle: (fileName: string) => void;
  isSelectionMode: boolean;
}

export default function FileItem({ file, listView, isSelected,onClick, onLongPress, onSelectToggle, isSelectionMode }: FileItemProps) {
  const timerRef = useRef<number | null>(null);
  const [clickDelayed, setClickDelayed] = useState<boolean>(false);
  const { _id: fileId } = file;

  function iconSwitch(file: IFileInfo) {
    const iconSrc = fileIconMap[file.type];
    return <img className={listView === "icons" ? styles.fileIcon : styles.fileListImage} src={iconSrc} alt="file icon" draggable={false} />;
  }

  function handleFileClick() {
    if (clickDelayed) {
      setClickDelayed(false);
      return; // Prevent the click action
    }
    if (isSelectionMode) {
      onSelectToggle(fileId!);
    } else {
      onClick(file)
    }
  }

  function handleMouseDown() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      onLongPress(fileId!);
      setClickDelayed(true);
    }, 300);
  }

  function handleMouseUp() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement | HTMLButtonElement>) {
    event.stopPropagation();
  }

  if (listView === "icons")
    return (
      <button className={isSelected ? styles.fileItemBoxSelected : styles.fileItemBox} onClick={handleFileClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onDragOver={handleDragOver}>
        <div className={styles.fileStatusBox}>{statusIconSwitch(file.status, isSelectionMode, isSelected)}</div>
        {iconSwitch(file)}
        <div className={styles.fileNameText}>{file.name}</div>
      </button>
    );

  return (
    <div
      className={listView === "recent" ? styles.recentListBox : isSelected ? styles.fileListBoxSelected : styles.fileListBox}
      onClick={handleFileClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
    >
      {listView !== "recent" && (
        <>
          <div className={styles.fileListStatusBox}>{statusIconSwitch(file.status, isSelectionMode, isSelected)}</div>
          <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
        </>
      )}
      {iconSwitch(file)}
      <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
      <div className={listView === "recent" ? styles.fileRecentNameText : styles.fileListNameText}>{file.name}</div>
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
