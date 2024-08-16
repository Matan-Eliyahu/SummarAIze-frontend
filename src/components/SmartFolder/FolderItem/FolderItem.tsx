import { FaBox, FaFolder, FaRegCalendar } from "react-icons/fa6";
import { FileListView, IFolder } from "../../../common/types";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import styles from "./FolderItem.module.scss";
import { statusIconSwitch } from "../FileItem/iconUtils";
import moment from "moment";

interface FolderItemProps {
  folder: IFolder;
  listView: FileListView;
  isSelected: boolean;
  onLongPress: (folderId: string) => void;
  onSelectToggle: (folderId: string) => void;
  isSelectionMode: boolean;
}

export default function FolderItem({ folder, listView, isSelected, onLongPress, onSelectToggle, isSelectionMode }: FolderItemProps) {
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const [clickDelayed, setClickDelayed] = useState<boolean>(false);

  function handleFolderClick() {
    if (clickDelayed) {
      setClickDelayed(false);
      return; // Prevent the click action
    }
    if (isSelectionMode) {
      onSelectToggle(folder._id!);
    } else {
      navigate(`/folders/${folder._id}`); // Adjust the route as needed
    }
  }

  function handleMouseDown() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      onLongPress(folder._id!);
      setClickDelayed(true); // Set clickDelayed to true when long press is detected
    }, 300); // Long press duration
  }

  function handleMouseUp() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
  }

  if (listView === "icons")
    return (
      <button className={isSelected ? styles.folderItemBoxSelected : styles.folderItemBox} onClick={handleFolderClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <div className={styles.folderIconBox}>
          <FaFolder className={styles.folderIcon} />
        </div>
        <div className={styles.folderNameText}>{folder.name}</div>
      </button>
    );

  return (
    <div className={isSelected ? styles.folderListBoxSelected : styles.folderListBox} onClick={handleFolderClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      {/* <div className={styles.fileListStatusBox}>
        <FaFolder className={styles.folderListIcon} />
      </div>
      <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
      <div className={styles.folderNameText}>{folder.name}</div> */}
      <div className={styles.fileListStatusBox}>{statusIconSwitch(folder.status, isSelectionMode, isSelected)}</div>
      <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
      <FaFolder className={styles.folderListIcon} />
      <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
      <div className={styles.fileListNameText}>{folder.name}</div>
      <div className={isSelected ? styles.seperatorSelected : styles.seperator} />

      <div className={styles.fileSizeText}>
        <FaBox className={styles.fileListIcon} />
        {`${folder.totalSize} MB`}
      </div>
      <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
      <div className={styles.fileSizeText}>
        <FaRegCalendar className={styles.fileListIcon} />
        {moment(folder.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
      </div>
    </div>
  );
}
