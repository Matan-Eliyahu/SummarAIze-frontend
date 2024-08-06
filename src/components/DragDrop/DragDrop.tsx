import React, { useEffect, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import DragDropToolbar, { FileSorting, SortingDirection } from "./DragDropToolbar/DragDropToolbar";
import { FaClone } from "react-icons/fa6";
import styles from "./DragDrop.module.scss";
import { FileListView, IFile } from "../../common/types";
import FileItem from "./FileItem/FileItem";
import ProgressBar from "../ProgressBar/ProgressBar";

pdfjs.GlobalWorkerOptions.workerSrc = "node_modules/pdfjs-dist/build/pdf.worker.mjs";

interface DragDropProps {
  files: IFile[];
  progress: number;
  onFileDrop: (files: File[]) => void;
  searchFiles: (searchTerm: string) => Promise<IFile[]>;
  setFilteredFiles: React.Dispatch<React.SetStateAction<IFile[] | null>>;
  onDeleteFiles: (fileNames: string[]) => Promise<void>;
  enableSmartSearch: boolean;
  defaultFileView: FileListView;
}

export default function DragDrop({ files, progress, onFileDrop, searchFiles, setFilteredFiles, onDeleteFiles, enableSmartSearch, defaultFileView }: DragDropProps) {
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [listView, setListView] = useState<FileListView>(defaultFileView);
  const [sortedFiles, setSortedFiles] = useState<IFile[]>([]);
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
    <div className={styles.dragDropBox}>
      <DragDropToolbar
        onViewChange={handleFileViewChange}
        onSortChange={handleSortChange}
        searchFiles={searchFiles}
        setFilteredFiles={setFilteredFiles}
        onFileSelect={handleFileSelect}
        onDeleteFiles={handleDeleteFiles}
        selectedFileNames={Array.from(selectedFilesNames)}
        isSelectionMode={isSelectionMode}
        enableSmartSearch={enableSmartSearch}
        defaultFileView={defaultFileView}
        onClearSelectedFiles={handleClearSelectedFiles}
      />
      <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} className={isDraggingOver ? styles.draggingOverBox : styles.filesBox}>
        <div className={progress > 0 ? styles.filesLoadingBox : listView === "icons" ? styles.filesDisplayBox : styles.filesListDisplayBox}>
          {progress > 0 ? (
            <div className={styles.progressBox}>
              {`Uploading... ${progress}%`}
              <div className={styles.progressBarBox}>
                <ProgressBar progress={progress} />
              </div>
            </div>
          ) : (
            sortedFiles.length > 0 &&
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
            ))
          )}
        </div>
        {sortedFiles.length === 0 && progress === 0 && <div className={styles.noFilesBox}>There is no files</div>}
        {progress === 0 && (listView !== "list" || files.length === 0) && (
          <div className={styles.dropText}>
            <FaClone />
            You can drag and drop files here
          </div>
        )}
      </div>
    </div>
  );
}
