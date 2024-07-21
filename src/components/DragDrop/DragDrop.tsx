import React, { useState } from "react";
import * as pdfjs from "pdfjs-dist";
import Toolbar, { FileListView } from "./Toolbar/Toolbar";
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
}

export default function DragDrop({ files, progress, onFileDrop }: DragDropProps) {
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [listView, setListView] = useState<FileListView>("icons");

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingOver(true);
  }

  function handleDragLeave() {
    setIsDraggingOver(false);
  }

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingOver(false);

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0 && onFileDrop) {
      onFileDrop(files);
    }
  }

  function handleFileViewChange(fileViewType: "list" | "icons") {
    setListView(fileViewType);
  }

  return (
    <div className={styles.dragDropBox}>
      <Toolbar onViewChange={handleFileViewChange} />
      <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} className={isDraggingOver ? styles.draggingOverBox : styles.filesBox}>
        <div className={progress > 0 ? styles.filesLoadingBox : listView === "icons" ? styles.filesDisplayBox : styles.filesListDisplayBox}>
          {progress > 0 ? (
            <div className={styles.progressBox}>
              Uploading...
              <ProgressBar progress={progress} />
            </div>
          ) : files.length > 0 ? (
            files.map((file, index) => <FileItem key={index} file={file} listView={listView} />)
          ) : (
            files.length === 0 && <div className={styles.noFilesBox}>No files here yet...</div>
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
