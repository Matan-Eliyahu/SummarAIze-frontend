import { FaArrowLeft, FaList } from "react-icons/fa6";
import { BsGridFill } from "react-icons/bs";
import styles from "./Toolbar.module.scss";
import { useState } from "react";

export type FileListView = "list" | "icons";

interface ToolbarProps {
  onViewChange: (viewType: FileListView) => void;
}

export default function Toolbar({ onViewChange }: ToolbarProps) {
  const [selectedView, setSelectedView] = useState<FileListView>("icons");

  function handleListViewChange(listView: FileListView) {
    setSelectedView(listView);
    onViewChange(listView);
  }

  return (
    <div className={styles.toolbarBox}>
      <div className={styles.backBox}>
        <button className={styles.backButton}>
          <FaArrowLeft className={styles.backIcon} />
        </button>
      </div>
      <div className={styles.viewBox}>
        <button className={selectedView == "icons" ? styles.viewButtonSelected : styles.viewButton} onClick={() => handleListViewChange("icons")}>
          <BsGridFill className={styles.viewIcon} />
        </button>
        <button className={selectedView == "list" ? styles.viewButtonSelected : styles.viewButton} onClick={() => handleListViewChange("list")}>
          <FaList className={styles.viewIcon} />
        </button>
      </div>
    </div>
  );
}
