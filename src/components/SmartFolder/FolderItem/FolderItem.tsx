import { FaBox, FaFolder, FaRegCalendar } from "react-icons/fa6";
import { FileListView, IFolder } from "../../../common/types";
import { useRef, useState } from "react";
import styles from "./FolderItem.module.scss";
import { statusIconSwitch } from "../FileItem/iconUtils";
import moment from "moment";

interface FolderItemProps {
  folder: IFolder;
  listView: FileListView;
  isSelected: boolean;
  onClick: (folder: IFolder) => void;
  onLongPress: (folderId: string) => void;
  onSelectToggle: (folderId: string) => void;
  isSelectionMode: boolean;
}

export default function FolderItem({ folder, listView, isSelected, onClick, onLongPress, onSelectToggle, isSelectionMode }: FolderItemProps) {
  const timerRef = useRef<number | null>(null);
  const [clickDelayed, setClickDelayed] = useState<boolean>(false);
  const isEmpty = folder.filesId.length === 0;

  function handleFolderClick() {
    if (clickDelayed) {
      setClickDelayed(false);
      return; // Prevent the click action
    }
    if (isSelectionMode) {
      onSelectToggle(folder._id!);
    } else {
      onClick(folder);
    }
  }

  function handleMouseDown() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      onLongPress(folder._id!);
      setClickDelayed(true);
    }, 300);
  }

  function handleMouseUp() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
  }

  if (listView === "icons")
    return (
      <button className={isSelected ? styles.folderIconButtonSelected : styles.folderIconButton} onClick={handleFolderClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        {
          <div className={isSelected || isSelectionMode ? styles.selectedFolderStatusBox : isEmpty ? styles.emptyFolderStatusBox : styles.folderStatusBox}>
            {statusIconSwitch(folder.status, isSelectionMode, isSelected)}
          </div>
        }
        <div className={styles.folderIconBox}>
          <FaFolder className={folder.isPrivate ? styles.folderIcon : styles.folderIconShared} />
        </div>
        <div className={styles.folderNameText}>{folder.name}</div>
      </button>
    );

  return (
    <div className={isSelected ? styles.folderListBoxSelected : styles.folderListBox} onClick={handleFolderClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <div className={styles.fileListStatusBox}>{statusIconSwitch(folder.status, isSelectionMode, isSelected)}</div>
      <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
      <FaFolder className={folder.isPrivate ? styles.privateListIcon : styles.sharedListIcon} />
      <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
      <div className={styles.fileListNameText}>{folder.name}</div>
      <div className={isSelected ? styles.seperatorSelected : styles.seperator} />

      <div className={styles.fileSizeText}>
        <FaBox className={styles.listIcon} />
        {folder.totalSize === 0 ? "Empty" : `${folder.totalSize.toFixed(2)} MB`}
      </div>
      <div className={isSelected ? styles.seperatorSelected : styles.seperator} />
      <div className={styles.fileSizeText}>
        <FaRegCalendar className={styles.listIcon} />
        {moment(folder.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
      </div>
    </div>
  );
}
