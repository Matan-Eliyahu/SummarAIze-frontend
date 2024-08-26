import React, { useEffect, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import SmartFolderToolbar from "./SmartFolderToolbar/SmartFolderToolbar";
import { FaClone } from "react-icons/fa6";
import { FileListView, FileSorting, IFileInfo, IFolder, SortingDirection } from "../../common/types";
import FileItem from "./FileItem/FileItem";
import ProgressBar from "../ProgressBar/ProgressBar";
import styles from "./SmartFolder.module.scss";
import FolderItem from "./FolderItem/FolderItem";
import Spinner from "../Spinner/Spinner";
import { isIFileInfo, sortFiles } from "../../utils/files";
import { useAlert } from "../../hooks/useAlert";

pdfjs.GlobalWorkerOptions.workerSrc = "node_modules/pdfjs-dist/build/pdf.worker.mjs";

interface SmartFolderProps {
  files: (IFileInfo | IFolder)[];
  folders: IFolder[];
  progress: number;
  currentFolder: IFolder | null;
  setCurrentFolder: React.Dispatch<React.SetStateAction<IFolder | null>>;
  onUploadFiles: (files: File[]) => void;
  onFolderClick: (folder: IFolder) => void;
  onFileClick: (file: IFileInfo) => void;
  onCreateFolder: () => void;
  onGoBack: () => void;
  onSearchFiles: (searchTerm: string) => Promise<(IFileInfo | IFolder)[]>;
  onSmartSearchFiles?: (searchTerm: string) => Promise<(IFileInfo | IFolder)[]>;
  setFilteredFiles: React.Dispatch<React.SetStateAction<(IFileInfo | IFolder)[] | null>>;
  onDeleteFiles: (filesId: string[]) => Promise<void>;
  onDeleteFolders: (foldersId: string[]) => Promise<void>;
  defaultFileView: FileListView;
  smartSearch?: boolean;
  loading?: boolean;
}

export default function SmartFolder({
  files,
  folders,
  progress,
  currentFolder,
  setCurrentFolder,
  onUploadFiles,
  onFolderClick,
  onFileClick,
  onCreateFolder,
  onGoBack,
  onSearchFiles,
  onSmartSearchFiles,
  setFilteredFiles,
  onDeleteFiles,
  onDeleteFolders,
  defaultFileView,
  smartSearch,
  loading,
}: SmartFolderProps) {
  const { setAlert, clearAlert } = useAlert();
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [listView, setListView] = useState<FileListView>(defaultFileView);
  const [sortedFiles, setSortedFiles] = useState<(IFileInfo | IFolder)[]>([]);
  const [sorting, setSorting] = useState<FileSorting>("by-recent");
  const [sortingDirection, setSortingDirection] = useState<SortingDirection>("desc");
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectedFilesId, setSelectedFilesId] = useState<Set<string>>(new Set());
  const [selectedFoldersId, setSelectedFoldersId] = useState<Set<string>>(new Set());
  const [clearSearchTerm, setClearSearchTerm] = useState(false);

  useEffect(() => {
    if (isSelectionMode && isDraggingOver) setIsDraggingOver(false);
  }, [isDraggingOver, isSelectionMode]);

  useEffect(() => {
    if (clearSearchTerm) setClearSearchTerm(false);
  }, [clearSearchTerm]);

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
      onUploadFiles(droppedFiles);
    }
  }

  function handleFileViewChange(fileViewType: FileListView) {
    setListView(fileViewType);
  }

  function handleSortChange(newSorting: FileSorting, newDirection: SortingDirection) {
    setSorting(newSorting);
    setSortingDirection(newDirection);
  }

  function handleUploadFiles(files: File[]) {
    if (onUploadFiles) {
      onUploadFiles(files);
    }
  }

  useEffect(() => {
    setSortedFiles(sortFiles(files, sorting, sortingDirection));
  }, [files, sorting, sortingDirection]);

  function handleFileLongPress(fileId: string) {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
    }
    setSelectedFilesId((prevSelectedFiles) => {
      const updatedSet = new Set(prevSelectedFiles);
      updatedSet.add(fileId);
      return updatedSet;
    });
  }

  function handleFolderLongPress(folderId: string) {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
    }
    setSelectedFoldersId((prevSelectedFolders) => {
      const updatedSet = new Set(prevSelectedFolders);
      updatedSet.add(folderId);
      return updatedSet;
    });
  }

  function handleFileSelectToggle(fileId: string) {
    setSelectedFilesId((prevSelectedFiles) => {
      const updatedSet = new Set(prevSelectedFiles);
      if (updatedSet.has(fileId)) {
        updatedSet.delete(fileId);
      } else {
        updatedSet.add(fileId);
      }

      if (updatedSet.size === 0) {
        setIsSelectionMode(false);
        setIsDraggingOver(false);
      }

      return updatedSet;
    });
  }

  function handleFolderSelectToggle(folderId: string) {
    setSelectedFoldersId((prevSelectedFolders) => {
      const updatedSet = new Set(prevSelectedFolders);
      if (updatedSet.has(folderId)) {
        updatedSet.delete(folderId);
      } else {
        updatedSet.add(folderId);
      }

      if (updatedSet.size === 0) {
        setIsSelectionMode(false);
        setIsDraggingOver(false);
      }

      return updatedSet;
    });
  }

  function handleDeleteItems() {
    const totalFiles = selectedFilesId.size;
    const totalFolders = selectedFoldersId.size;

    if (totalFiles > 0 || totalFolders > 0) {
      let alertText = "Are you sure you want to permanently delete ";

      if (totalFiles === 1 && totalFolders === 0) {
        const fileId = [...selectedFilesId][0];
        const fileName = files.find((file) => file._id === fileId)?.name || ""; // Retrieve the file name by ID
        alertText += `the file "${fileName}"?`;
      } else if (totalFiles === 0 && totalFolders === 1) {
        const folderId = [...selectedFoldersId][0];
        const folderName = folders.find((folder) => folder._id === folderId)?.name || ""; // Retrieve the folder name by ID
        alertText += `the folder "${folderName}"?`;
      } else if (totalFiles > 0 && totalFolders > 0) {
        alertText += `${totalFiles} ${totalFiles > 1 ? "files" : "file"} and ${totalFolders} ${totalFolders > 1 ? "folders" : "folder"}?`;
      } else if (totalFiles > 0) {
        alertText += `${totalFiles} ${totalFiles > 1 ? "files" : "file"}?`;
      } else if (totalFolders > 0) {
        alertText += `${totalFolders} ${totalFolders > 1 ? "folders" : "folder"}?`;
      }

      setAlert({
        text: alertText,
        buttonColor: "cancel",
        secondButtonText: "Delete",
        secondButtonColor: "danger",
        onSecondButtonClick: async () => {
          clearAlert();
          if (totalFolders > 0) {
            await handleDeleteFolders([...selectedFoldersId]);
          }
          if (totalFiles > 0) {
            await handleDeleteFiles([...selectedFilesId]);
          }
        },
      });
    }
  }

  async function handleDeleteFiles(filesId: string[]) {
    await onDeleteFiles(filesId);
    setIsSelectionMode(false);
    setSelectedFilesId(new Set());
    setIsDraggingOver(false);
  }

  async function handleDeleteFolders(foldersId: string[]) {
    await onDeleteFolders(foldersId);
    setIsSelectionMode(false);
    setSelectedFoldersId(new Set());
    setIsDraggingOver(false);
  }

  function handleClearSelectedFiles() {
    setIsSelectionMode(false);
    setSelectedFilesId(new Set());
    setSelectedFoldersId(new Set());
    setIsDraggingOver(false);
  }

  function handleFolderClick(folder: IFolder) {
    setCurrentFolder(folder);
    onFolderClick(folder);
  }

  function handleGoBack() {
    setClearSearchTerm(true);
    setCurrentFolder(null);
    onGoBack();
  }

  return (
    <div className={styles.smartFolderBox}>
      <SmartFolderToolbar
        folder={currentFolder}
        selectedItemsCount={selectedFilesId.size + selectedFoldersId.size}
        isSelectionMode={isSelectionMode}
        defaultFileView={defaultFileView}
        smartSearch={smartSearch}
        setFilteredFiles={setFilteredFiles}
        onViewChange={handleFileViewChange}
        onSortChange={handleSortChange}
        onSearchFiles={onSearchFiles}
        onSmartSearchFiles={onSmartSearchFiles}
        onUploadFiles={handleUploadFiles}
        onDeleteItems={handleDeleteItems}
        onCreateFolder={onCreateFolder}
        onClearSelectedFiles={handleClearSelectedFiles}
        onGoBack={handleGoBack}
        loading={loading}
        clearSearchTerm={clearSearchTerm}
      />
      <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} className={isDraggingOver ? styles.draggingOverBox : styles.filesBox}>
        <div className={progress > 0 ? styles.filesLoadingBox : loading ? styles.loadingBox : listView === "icons" ? styles.filesDisplayBox : styles.filesListDisplayBox}>
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
              {sortedFiles.length > 0 &&
                sortedFiles.map((item, index) => {
                  if (isIFileInfo(item))
                    return (
                      <FileItem
                        key={index}
                        file={item}
                        listView={listView}
                        isSelected={selectedFilesId.has(item._id!)}
                        onClick={onFileClick}
                        onLongPress={handleFileLongPress}
                        onSelectToggle={handleFileSelectToggle}
                        isSelectionMode={isSelectionMode}
                      />
                    );
                  else
                    return (
                      <FolderItem
                        key={index}
                        folder={item}
                        listView={listView}
                        isSelected={selectedFoldersId.has(item._id!)}
                        onLongPress={handleFolderLongPress}
                        onSelectToggle={handleFolderSelectToggle}
                        isSelectionMode={isSelectionMode}
                        onClick={handleFolderClick}
                      />
                    );
                })}
            </>
          )}
        </div>
        {(sortedFiles.length === 0 || folders.length === 0) && progress === 0 && !loading && <div className={styles.noFilesBox}>{currentFolder ? "Folder is empty..." : "There is no files..."}</div>}
        {progress === 0 && !loading && (
          <div className={styles.dropText}>
            <FaClone />
            You can drag and drop files here
          </div>
        )}
      </div>
    </div>
  );
}
