import React, { useState } from "react";
import * as pdfjs from "pdfjs-dist";
import Toolbar from "./Toolbar/Toolbar";
import { fileIconMap } from "../../common/icons";
import { getFileType } from "../../utils/files";
import { FaArrowPointer } from "react-icons/fa6";
import styles from "./DragDrop.module.scss";

pdfjs.GlobalWorkerOptions.workerSrc = "node_modules/pdfjs-dist/build/pdf.worker.mjs";

interface DragDropProps {
  onFileDrop?: (files: File[]) => void;
}

const DragDrop: React.FC<DragDropProps> = ({ onFileDrop }) => {
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const iconSwitch = (fileType: string): JSX.Element => {
    const type = getFileType(fileType);
    const iconSrc = fileIconMap[type];
    return <img className={styles.fileIcon} src={iconSrc} alt="file icon" />;
  };

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
    if (files.length > 0) {
      setDroppedFiles((prevFiles) => [...prevFiles, ...files]);
      if (onFileDrop) {
        onFileDrop(files);
      }
    }
  }

  function handleFileViewChange(fileViewType: "list" | "icons") {
    console.log(fileViewType);
  }

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} className={isDraggingOver ? styles.draggingOver : styles.dragAndDropBox}>
      <Toolbar onViewChange={handleFileViewChange} />
      {droppedFiles.length > 0 && (
        <div className={styles.filesContainer}>
          {droppedFiles.map((file, index) => (
            <button className={styles.fileIconBox} key={index}>
              {iconSwitch(file.type)}
              <div className={styles.fileNameText}>{file.name}</div>
            </button>
          ))}
        </div>
      )}
      <div className={styles.dropText}>
        <FaArrowPointer />
        You can drag and drop file in here
      </div>
    </div>
  );
};

export default DragDrop;
