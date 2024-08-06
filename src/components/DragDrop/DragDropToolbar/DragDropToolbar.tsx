import { FaA, FaArrowDown, FaArrowUp, FaBox, FaCircleCheck, FaClockRotateLeft, FaList, FaPlus, FaTrash } from "react-icons/fa6";
import { BsGridFill } from "react-icons/bs";
import styles from "./DragDropToolbar.module.scss";
import { useState, useRef } from "react";
import { FileListView, IFile } from "../../../common/types";
import SearchBar from "../../SearchBar/SearchBar";
import { useError } from "../../../hooks/useError";

export type FileSorting = "by-name" | "by-size" | "by-recent";
export type SortingDirection = "asc" | "desc";

// const fileSortingLabels: Record<FileSorting, string> = {
//   "by-name": "Name",
//   "by-size": "Size",
//   "by-recent": "Recent",
// };

interface ToolbarProps {
  onViewChange: (viewType: FileListView) => void;
  onSortChange: (newSorting: FileSorting, newDirection: SortingDirection) => void;
  searchFiles: (searchTerm: string) => Promise<IFile[]>;
  setFilteredFiles: React.Dispatch<React.SetStateAction<IFile[] | null>>;
  onFileSelect: (files: File[]) => void;
  onDeleteFiles: (fileNames: string[]) => Promise<void>;
  selectedFileNames: string[];
  isSelectionMode: boolean;
  enableSmartSearch: boolean;
  defaultFileView: FileListView;
  onClearSelectedFiles:()=>void;
}

export default function DragDropToolbar({
  onViewChange,
  onSortChange,
  searchFiles,
  setFilteredFiles,
  onFileSelect,
  isSelectionMode,
  onDeleteFiles,
  selectedFileNames,
  enableSmartSearch,
  defaultFileView,
  onClearSelectedFiles,
}: ToolbarProps) {
  const { setAlert, clearAlert } = useError();
  const [selectedView, setSelectedView] = useState<FileListView>(defaultFileView);
  const [selectedSorting, setSelectedSorting] = useState<FileSorting>("by-recent");
  const [sortingDirection, setSortingDirection] = useState<SortingDirection>("asc");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleListViewChange(listView: FileListView) {
    setSelectedView(listView);
    onViewChange(listView);
  }

  function sortIconSwitch(sortType: FileSorting) {
    switch (sortType) {
      case "by-name":
        return <FaA className={styles.sortTypeIcon} />;
      case "by-size":
        return <FaBox className={styles.sortTypeIcon} />;
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

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      onFileSelect(Array.from(event.target.files));
    }
  }

  function handleDeleteButtonClick() {
    if (selectedFileNames.length > 0) {
      setAlert({
        text: `Are you sure you want to permanently delete ${selectedFileNames.length > 1 ? `${selectedFileNames.length} files` : selectedFileNames[0]} ?`,
        secondButtonText: "Delete",
        secondButtonColor: "danger",
        onSecondButtonClick: () => {
          clearAlert();
          onDeleteFiles(selectedFileNames);
        },
      });
    }
  }

  return (
    <div className={styles.toolbarBox}>
      {isSelectionMode ? (
        <div className={styles.addFileBox}>
          <button className={styles.deleteFilesButton} onClick={handleDeleteButtonClick}>
            <FaTrash className={styles.deleteFileIcon} />
          </button>
          <button className={styles.clearSelectionButton} onClick={onClearSelectedFiles}>
            <FaCircleCheck className={styles.clearSelectionIcon} />
            {`Selected (${selectedFileNames.length})`}
          </button>
        </div>
      ) : (
        <div className={styles.addFileBox}>
          <button className={styles.addFileButton} onClick={() => fileInputRef.current?.click()}>
            <FaPlus className={styles.addFileIcon} />
            <div className={styles.hoverText}>Upload files</div>
          </button>
          <input type="file" multiple ref={fileInputRef} style={{ display: "none" }} onChange={handleFileInputChange} />
        </div>
      )}

      {enableSmartSearch && (
        <div className={styles.searchBarBox}>
          <SearchBar fetchFunction={searchFiles} setData={setFilteredFiles} placeholder="Search files..." />
        </div>
      )}
      <div className={styles.sortButtonBox}>
        <button className={styles.sortTypeButton} onClick={handleSortIconChange}>
          <div className={styles.sortingLabel}>
            {sortIconSwitch(selectedSorting)}
            {/* <div className={styles.sortingButtonLabel}>{fileSortingLabels[selectedSorting]}</div> */}
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
