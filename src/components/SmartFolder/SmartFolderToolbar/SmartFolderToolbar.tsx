import { FaA, FaArrowDown, FaArrowUp, FaBox, FaChevronLeft, FaCircleCheck, FaClockRotateLeft, FaFile, FaFolder, FaList, FaPlus, FaTrash } from "react-icons/fa6";
import { BsGridFill } from "react-icons/bs";
import { useState, useRef } from "react";
import { FileListView, FileSorting, IFileInfo, IFolder, SortingDirection } from "../../../common/types";
import SearchBar from "../../SearchBar/SearchBar";
import styles from "./SmartFolderToolbar.module.scss";

interface SmartFolderToolbar {
  folder: IFolder | null;
  selectedItemsCount: number;
  isSelectionMode: boolean;
  defaultFileView: FileListView;
  smartSearch?: boolean;
  onViewChange: (viewType: FileListView) => void;
  onSortChange: (newSorting: FileSorting, newDirection: SortingDirection) => void;
  onSearchFiles: (searchTerm: string) => Promise<(IFileInfo | IFolder)[]>;
  onSmartSearchFiles?: (searchTerm: string) => Promise<(IFileInfo | IFolder)[]>;
  setFilteredFiles: React.Dispatch<React.SetStateAction<(IFileInfo | IFolder)[] | null>>;
  onUploadFiles: (files: File[]) => void;
  onCreateFolder: () => void;
  onGoBack: () => void;
  onDeleteItems: () => void;
  onClearSelectedFiles: () => void;
  loading?: boolean;
  clearSearchTerm?:boolean;
}

export default function SmartFolderToolbar({
  onViewChange,
  onSortChange,
  onSearchFiles,
  onSmartSearchFiles,
  setFilteredFiles,
  onUploadFiles,
  onCreateFolder,
  onGoBack,
  folder,
  isSelectionMode,
  onDeleteItems,
  selectedItemsCount,
  defaultFileView,
  smartSearch,
  onClearSelectedFiles,
  loading,
  clearSearchTerm,
}: SmartFolderToolbar) {
  const [selectedView, setSelectedView] = useState<FileListView>(defaultFileView);
  const [selectedSorting, setSelectedSorting] = useState<FileSorting>("by-recent");
  const [sortingDirection, setSortingDirection] = useState<SortingDirection>("desc");
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
      onUploadFiles(Array.from(event.target.files));
    }

    event.target.value = "";
  }

  return (
    <div className={styles.toolbarBox}>
      {isSelectionMode ? (
        <div className={styles.addFileBox}>
          <button className={styles.deleteFilesButton} onClick={onDeleteItems} disabled={loading}>
            <FaTrash className={styles.deleteFileIcon} />
          </button>
          <button className={styles.clearSelectionButton} onClick={onClearSelectedFiles} disabled={loading}>
            <FaCircleCheck className={styles.clearSelectionIcon} />
            {`Selected (${selectedItemsCount})`}
          </button>
        </div>
      ) : (
        <div className={styles.addFileBox}>
          {folder && (
            <button className={styles.backButton} onClick={onGoBack} disabled={loading}>
              <FaChevronLeft className={styles.backIcon} />
              Dashboard
            </button>
          )}
          {!folder && (
            <button className={styles.addFolderButton} onClick={onCreateFolder} disabled={loading}>
              <FaFolder className={styles.addFolderIcon} />
              New folder
            </button>
          )}
          <button className={styles.addFileButton} onClick={() => fileInputRef.current?.click()} disabled={loading}>
            <FaPlus className={styles.addFileIcon} />
            <div className={styles.hoverText}>Upload files</div>
          </button>
          <input type="file" multiple ref={fileInputRef} style={{ display: "none" }} onChange={handleFileInputChange} />
        </div>
      )}

      <div className={styles.searchBarBox}>
        <SearchBar
          fetchFunction={onSearchFiles}
          clearSearchTerm={clearSearchTerm}
          smartSearchFetchFunction={onSmartSearchFiles}
          setData={setFilteredFiles}
          placeholder="Search files..."
          smartSearch={smartSearch}
          disabled={loading}
        />
      </div>

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
