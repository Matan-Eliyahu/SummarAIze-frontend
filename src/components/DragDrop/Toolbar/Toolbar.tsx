import { FaArrowDown, FaArrowLeft, FaArrowUp, FaBoxOpen, FaClock, FaFont, FaList } from "react-icons/fa6";
import { BsGridFill } from "react-icons/bs";
import styles from "./Toolbar.module.scss";
import { useState } from "react";

export type FileListView = "list" | "icons";
export type FileSorting = "by-name" | "by-size" | "by-recent";
export type SortingDirection = "asc" | "desc";

interface ToolbarProps {
  onViewChange: (viewType: FileListView) => void;
  onSortChange: (newSorting: FileSorting, newDirection: SortingDirection) => void;
}

export default function Toolbar({ onViewChange, onSortChange }: ToolbarProps) {
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
        return <FaFont className={styles.viewIcon} />;
      case "by-size":
        return <FaBoxOpen className={styles.viewIcon} />;
      case "by-recent":
        return <FaClock className={styles.viewIcon} />;
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
      <div className={styles.backBox}>
        <button className={styles.backButton}>
          <FaArrowLeft className={styles.backIcon} />
        </button>
      </div>
      <div className={styles.sortButtonBox}>
        <button className={styles.sortButton} onClick={handleToggleDirection}>
          {sortingDirection === "asc" ? <FaArrowUp className={styles.viewIcon} /> : <FaArrowDown className={styles.viewIcon} />}
        </button>
        <div className={styles.seperator} />
        <button className={styles.sortButton} onClick={handleSortIconChange}>
          {sortIconSwitch(selectedSorting)}
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
