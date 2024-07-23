import { FaA, FaArrowDown, FaArrowUp, FaClockRotateLeft, FaInbox, FaList } from "react-icons/fa6";
import { BsGridFill } from "react-icons/bs";
import styles from "./DragDropToolbar.module.scss";
import { useState } from "react";

export type FileListView = "list" | "icons" | "recent";
export type FileSorting = "by-name" | "by-size" | "by-recent";
export type SortingDirection = "asc" | "desc";

const fileSortingLabels: Record<FileSorting, string> = {
  "by-name": "Name",
  "by-size": "Size",
  "by-recent": "Recent",
};

interface ToolbarProps {
  onViewChange: (viewType: FileListView) => void;
  onSortChange: (newSorting: FileSorting, newDirection: SortingDirection) => void;
}

export default function DragDropToolbar({ onViewChange, onSortChange }: ToolbarProps) {
  const [selectedView, setSelectedView] = useState<FileListView>("icons");
  const [selectedSorting, setSelectedSorting] = useState<FileSorting>("by-recent");
  const [sortingDirection, setSortingDirection] = useState<SortingDirection>("asc");

  function handleListViewChange(listView: FileListView) {
    setSelectedView(listView);
    onViewChange(listView);
  }

  function sortIconSwitch(sortType: FileSorting) {
    switch (sortType) {
      case "by-name":
        return <FaA className={styles.sortTypeIcon} />;
      case "by-size":
        return <FaInbox className={styles.sortTypeIcon} />;
      case "by-recent":
        return <FaClockRotateLeft className={styles.sortTypeIcon} />;
    }
  }

  function handleSortIconChange() {
    const sortingOptions: FileSorting[] = ["by-name", "by-size", "by-recent"];
    const currentIndex = sortingOptions.indexOf(selectedSorting);
    const nextIndex = (currentIndex + 1) % sortingOptions.length;
    const newSorting = sortingOptions[nextIndex];

    setSelectedSorting(newSorting);
    onSortChange(newSorting, sortingDirection);
  }

  function handleToggleDirection() {
    const newDirection = sortingDirection === "asc" ? "desc" : "asc";
    setSortingDirection(newDirection);
    onSortChange(selectedSorting, newDirection);
  }

  return (
    <div className={styles.toolbarBox}>
      {/* <div className={styles.backBox}>
        <button className={styles.backButton}>
          <FaArrowLeft className={styles.backIcon} />
        </button>
      </div> */}
      <div className={styles.sortButtonBox}>
        <button className={styles.sortTypeButton} onClick={handleSortIconChange}>
          <div className={styles.fileSotringLabel}>
            {sortIconSwitch(selectedSorting)}
            <div className={styles.fileSortingButtonLabel}>{fileSortingLabels[selectedSorting]}</div>
          </div>
        </button>
        <div className={styles.seperator} />
        <button className={styles.sortButton} onClick={handleToggleDirection}>
          {sortingDirection === "asc" ? <FaArrowUp className={styles.viewIcon} size={18} /> : <FaArrowDown className={styles.viewIcon} size={18} />}
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
