import React, { useState } from "react";
import styles from "./DragDrop.module.scss";
import { WiCloudUp } from "react-icons/wi";
import * as pdfjs from "pdfjs-dist";
import { fileIconMap } from "../../common/icons";
import { getFileType } from "../../utils/files";

pdfjs.GlobalWorkerOptions.workerSrc = "node_modules/pdfjs-dist/build/pdf.worker.mjs"; // Replace with the actual path to pdf.worker.js

interface DragDropProps {
  onFileDrop?: (files: File[]) => void; // Optional callback function to handle dropped files
}

const DragDrop: React.FC<DragDropProps> = ({ onFileDrop }) => {
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const iconSwitch = (fileType: string): JSX.Element => {
    const type = getFileType(fileType);
    const iconSrc = fileIconMap[type]
    return <img src={iconSrc} alt="logo" style={{ width: "3rem" }} />;
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      setDroppedFiles(files);

      if (onFileDrop) {
        onFileDrop(files);
      }
    }
  };

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} className={isDraggingOver ? styles.draggingOver : styles.dragAndDropBox}>
      {droppedFiles.length > 0 && (
        <div>
          {droppedFiles.map((file, index) => (
            <div className={styles.fileIconBox} key={index}>
              {iconSwitch(file.type)}
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      )}
      {isDraggingOver && <WiCloudUp className={styles.cloud} />}
    </div>
  );
};

export default DragDrop;
