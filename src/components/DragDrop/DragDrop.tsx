import React, { useEffect, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import DragDropToolbar, { FileListView, FileSorting, SortingDirection } from "./DragDropToolbar/DragDropToolbar";
import { FaClone } from "react-icons/fa6";
import styles from "./DragDrop.module.scss";
import { IFile } from "../../common/types";
import FileItem from "./FileItem/FileItem";
import ProgressBar from "../ProgressBar/ProgressBar";

pdfjs.GlobalWorkerOptions.workerSrc = "node_modules/pdfjs-dist/build/pdf.worker.mjs";

interface DragDropProps {
  files: IFile[];
  progress: number;
  onFileDrop?: (files: File[]) => void;
  searchFiles: (searchTerm: string) => Promise<IFile[]>;
  setFilteredFiles: React.Dispatch<React.SetStateAction<IFile[] | null>>;
  onDeleteFiles: (fileNames: string[]) => Promise<void>;
}

export default function DragDrop({ files, progress, onFileDrop, searchFiles, setFilteredFiles, onDeleteFiles }: DragDropProps) {
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [listView, setListView] = useState<FileListView>("icons");
  const [sortedFiles, setSortedFiles] = useState<IFile[]>([]);
  const [sorting, setSorting] = useState<FileSorting>("by-recent");
  const [sortingDirection, setSortingDirection] = useState<SortingDirection>("asc");
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectedFilesNames, setSelectedFilesNames] = useState<Set<string>>(new Set());

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    if (progress > 0) return;
    event.preventDefault();
    setIsDraggingOver(true);
  }

  function handleDragLeave() {
    if (progress > 0) return;
    setIsDraggingOver(false);
  }

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    if (progress > 0 || isSelectionMode) return;
    event.preventDefault();
    setIsDraggingOver(false);

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0 && onFileDrop) {
      onFileDrop(files);
    }
  }

  function handleFileViewChange(fileViewType: "list" | "icons" | "recent") {
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
      console.log("Long press added:", fileName);
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
      }

      console.log("File select toggle:", fileName, updatedSet);
      return updatedSet;
    });
  }

  async function handleDeleteFiles(fileNames:string[]) {
      await onDeleteFiles(fileNames);
      setIsSelectionMode(false)
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
      />
      <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} className={isDraggingOver ? styles.draggingOverBox : styles.filesBox}>
        <div className={progress > 0 ? styles.filesLoadingBox : listView === "icons" ? styles.filesDisplayBox : styles.filesListDisplayBox}>
          {sortedFiles.length > 0
            ? sortedFiles.map((file, index) => (
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
            : sortedFiles.length === 0 && progress === 0 && <div className={styles.noFilesBox}>No files here yet...</div>}
          {progress > 0 && (
            <div className={styles.progressBox}>
              {`Uploading... ${progress}%`}
              <div className={styles.progressBarBox}>
                <ProgressBar progress={progress} />
              </div>
            </div>
          )}
        </div>
        {progress === 0 && (
          <div className={styles.dropText}>
            <FaClone />
            You can drag and drop files here
          </div>
        )}
      </div>
    </div>
  );
}
