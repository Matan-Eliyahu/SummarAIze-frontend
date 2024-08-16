import { FaA, FaArrowDown, FaArrowUp, FaBox, FaCircleCheck, FaClockRotateLeft, FaFile, FaFolder, FaList, FaPlus, FaTrash } from "react-icons/fa6";
import { BsGridFill } from "react-icons/bs";
import { useState, useRef } from "react";
import { FileListView, IFileInfo } from "../../../common/types";
import SearchBar from "../../SearchBar/SearchBar";
import { useAlert } from "../../../hooks/useAlert";
import styles from "./SmartFolderToolbar.module.scss";

export type FileSorting = "by-name" | "by-size" | "by-recent" | "by-type";
export type SortingDirection = "asc" | "desc";

interface SmartFolderToolbar {
  onViewChange: (viewType: FileListView) => void;
  onSortChange: (newSorting: FileSorting, newDirection: SortingDirection) => void;
  onFilesSearch: (searchTerm: string) => Promise<IFileInfo[]>;
  setFilteredFiles: React.Dispatch<React.SetStateAction<IFileInfo[] | null>>;
  onFileSelect: (files: File[]) => void;
  onCreateFolder: () => void;
  onGoBack: () => void;
  onDeleteFiles: (fileNames: string[]) => Promise<void>;
  selectedFileNames: string[];
  isSelectionMode: boolean;
  enableSmartSearch: boolean;
  defaultFileView: FileListView;
  onClearSelectedFiles: () => void;
}

export default function SmartFolderToolbar({
  onViewChange,
  onSortChange,
  onFilesSearch,
  setFilteredFiles,
  onFileSelect,
  onCreateFolder,
  onGoBack,
  isSelectionMode,
  onDeleteFiles,
  selectedFileNames,
  enableSmartSearch,
  defaultFileView,
  onClearSelectedFiles,
}: SmartFolderToolbar) {
  const { setAlert, clearAlert } = useAlert();
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
      case "by-type":
        return <FaFile className={styles.sortTypeIcon} />;
    }
  }

  function sortTypeLabelSwitch(sortType: FileSorting) {
    switch (sortType) {
      case "by-name":
        return "Name";
      case "by-recent":
        return "Recent";
      case "by-size":
        return "Size";
      case "by-type":
        return "Type";
    }
  }

  function handleSortIconChange() {
    const sortingOptions: FileSorting[] = ["by-name", "by-size", "by-recent", "by-type"];
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

    event.target.value = "";
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
          <button className={styles.addFolderButton} onClick={onCreateFolder}>
            <FaFolder className={styles.addFolderIcon} />
            New folder
            {/* <div className={styles.hoverText}>New Folder</div> */}
          </button>
        </div>
      )}

      {enableSmartSearch && (
        <div className={styles.searchBarBox}>
          <SearchBar fetchFunction={onFilesSearch} setData={setFilteredFiles} placeholder="Search files..." />
        </div>
      )}
      <div className={styles.sortButtonBox}>
        <button className={styles.sortTypeButton} onClick={handleSortIconChange}>
          <div className={styles.sortingLabel}>{sortIconSwitch(selectedSorting)}</div>
          <div className={styles.sortTypeButtonLabel}>{sortTypeLabelSwitch(selectedSorting)}</div>
        </button>
        <div className={styles.seperator} />
        <button className={styles.sortButton} onClick={handleToggleDirection}>
          {sortingDirection === "asc" ? <FaArrowUp className={styles.sortTypeIcon} /> : <FaArrowDown className={styles.sortTypeIcon} />}
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
