import React, { useEffect, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import SmartFolderToolbar, { FileSorting, SortingDirection } from "./SmartFolderToolbar/SmartFolderToolbar";
import { FaClone } from "react-icons/fa6";
import { FileListView, IFileInfo, IFolder } from "../../common/types";
import FileItem from "./FileItem/FileItem";
import ProgressBar from "../ProgressBar/ProgressBar";
import styles from "./SmartFolder.module.scss";
import FolderItem from "./FolderItem/FolderItem";
import Spinner from "../Spinner/Spinner";

pdfjs.GlobalWorkerOptions.workerSrc = "node_modules/pdfjs-dist/build/pdf.worker.mjs";

interface SmartFolderProps {
  files: IFileInfo[];
  folders: IFolder[];
  progress: number;
  onFileDrop: (files: File[]) => void;
  onFolderSelect: (folder: IFolder) => void;
  onCreateFolder: () => void;
  onGoBack: () => void;
  onFilesSearch: (searchTerm: string) => Promise<IFileInfo[]>;
  setFilteredFiles: React.Dispatch<React.SetStateAction<IFileInfo[] | null>>;
  onDeleteFiles: (fileNames: string[]) => Promise<void>;
  enableSmartSearch: boolean;
  defaultFileView: FileListView;
  loading: boolean;
}

export default function SmartFolder({
  files,
  folders,
  progress,
  onFileDrop,
  onFolderSelect,
  onCreateFolder,
  onGoBack,
  onFilesSearch,
  setFilteredFiles,
  onDeleteFiles,
  enableSmartSearch,
  defaultFileView,
  loading,
}: SmartFolderProps) {
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [listView, setListView] = useState<FileListView>(defaultFileView);
  const [sortedFiles, setSortedFiles] = useState<IFileInfo[]>([]);
  const [sorting, setSorting] = useState<FileSorting>("by-recent");
  const [sortingDirection, setSortingDirection] = useState<SortingDirection>("asc");
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectedFilesNames, setSelectedFilesNames] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isSelectionMode && isDraggingOver) setIsDraggingOver(false);
  }, [isDraggingOver, isSelectionMode]);

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    if (progress > 0 || isSelectionMode) return;
    event.preventDefault();
    setIsDraggingOver(true);
  }

  function handleDragLeave() {
    if (progress > 0 || isSelectionMode) return;
    setIsDraggingOver(false);
  }

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    if (progress > 0 || isSelectionMode) return;
    event.preventDefault();
    setIsDraggingOver(false);

    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFileDrop(droppedFiles);
      console.log(droppedFiles);
    }
  }

  function handleFileViewChange(fileViewType: FileListView) {
    setListView(fileViewType);
  }

  function handleSortChange(newSorting: FileSorting, newDirection: SortingDirection) {
    setSorting(newSorting);
    setSortingDirection(newDirection);
  }

  function handleFileSelect(files: File[]) {
    if (onFileDrop) {
      onFileDrop(files);
    }
  }

  useEffect(() => {
    function sortFiles() {
      const sorted = [...files];
      if (sorting === "by-name") {
        sorted.sort((a, b) => (sortingDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
      } else if (sorting === "by-size") {
        sorted.sort((a, b) => (sortingDirection === "asc" ? a.size - b.size : b.size - a.size));
      } else if (sorting === "by-recent") {
        sorted.sort((a, b) =>
          sortingDirection === "asc" ? new Date(a.uploadedAt ?? 0).getTime() - new Date(b.uploadedAt ?? 0).getTime() : new Date(b.uploadedAt ?? 0).getTime() - new Date(a.uploadedAt ?? 0).getTime()
        );
      } else if (sorting === "by-type") {
        sorted.sort((a, b) => (sortingDirection === "asc" ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)));
      }
      setSortedFiles(sorted);
    }

    sortFiles();
  }, [files, sorting, sortingDirection]);

  function handleLongPress(fileName: string) {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
    }
    setSelectedFilesNames((prevSelectedFiles) => {
      const updatedSet = new Set(prevSelectedFiles);
      updatedSet.add(fileName);
      return updatedSet;
    });
  }

  function handleFileSelectToggle(fileName: string) {
    setSelectedFilesNames((prevSelectedFiles) => {
      const updatedSet = new Set(prevSelectedFiles);
      if (updatedSet.has(fileName)) {
        updatedSet.delete(fileName);
      } else {
        updatedSet.add(fileName);
      }

      if (updatedSet.size === 0) {
        setIsSelectionMode(false);
        setIsDraggingOver(false);
      }

      return updatedSet;
    });
  }

  async function handleDeleteFiles(fileNames: string[]) {
    await onDeleteFiles(fileNames);
    setIsSelectionMode(false);
    setSelectedFilesNames(new Set());
    setIsDraggingOver(false);
  }

  function handleClearSelectedFiles() {
    setIsSelectionMode(false);
    setSelectedFilesNames(new Set());
    setIsDraggingOver(false);
  }

  return (
    <div className={styles.smartFolderBox}>
      <SmartFolderToolbar
        onViewChange={handleFileViewChange}
        onSortChange={handleSortChange}
        onFilesSearch={onFilesSearch}
        setFilteredFiles={setFilteredFiles}
        onFileSelect={handleFileSelect}
        onDeleteFiles={handleDeleteFiles}
        onCreateFolder={onCreateFolder}
        onGoBack={onGoBack}
        selectedFileNames={Array.from(selectedFilesNames)}
        isSelectionMode={isSelectionMode}
        enableSmartSearch={enableSmartSearch}
        defaultFileView={defaultFileView}
        onClearSelectedFiles={handleClearSelectedFiles}
      />
      <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} className={isDraggingOver ? styles.draggingOverBox : styles.filesBox}>
        <div className={progress > 0  ? styles.filesLoadingBox :loading ? styles.loadingBox : listView === "icons" ? styles.filesDisplayBox : styles.filesListDisplayBox}>
          {progress > 0 ? (
            <div className={styles.progressBox}>
              {`Uploading... ${progress}%`}
              <div className={styles.progressBarBox}>
                <ProgressBar progress={progress} />
              </div>
            </div>
          ) : loading ? (
            <div className={styles.spinnerBox}>
              Loading files...
              <Spinner size="l" />
            </div>
          ) : (
            <>
              {folders.map((folder, index) => (
                <FolderItem key={index} folder={folder} listView={listView} isSelected={false} onLongPress={() => {}} onSelectToggle={() => {}} isSelectionMode={false} />
              ))}
              {sortedFiles.length > 0 &&
                sortedFiles.map((file, index) => (
                  <FileItem
                    key={index}
                    file={file}
                    listView={listView}
                    isSelected={selectedFilesNames.has(file.name)}
                    onLongPress={handleLongPress}
                    onSelectToggle={handleFileSelectToggle}
                    isSelectionMode={isSelectionMode}
                  />
                ))}
            </>
          )}
        </div>
        {sortedFiles.length === 0 && folders.length === 0 && progress === 0 && <div className={styles.noFilesBox}>There is no files...</div>}
        {progress === 0 && !loading && (listView !== "list" || files.length === 0) && (
          <div className={styles.dropText}>
            <FaClone />
            You can drag and drop files here
          </div>
        )}
      </div>
    </div>
  );
}
