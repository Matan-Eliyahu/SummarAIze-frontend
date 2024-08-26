import { FileSorting, FileType, IFileInfo, IFolder, ISettings, IStorage, SortingDirection } from "../common/types";

export function getFileType(mimeType: string): FileType | null {
  if (mimeType.startsWith("image/")) {
    return "image";
  } else if (mimeType.startsWith("audio/")) {
    return "audio";
  } else if (mimeType === "application/pdf") {
    return "pdf";
  } else {
    return null;
  }
}

export function getFileTypeByName(fileName: string): FileType | null {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) {
    return null;
  }

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "svg"];
  const audioExtensions = ["mp3", "wav", "aac", "flac", "ogg", "m4a"];
  const pdfExtensions = ["pdf"];

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (audioExtensions.includes(extension)) {
    return "audio";
  } else if (pdfExtensions.includes(extension)) {
    return "pdf";
  } else {
    return null; // or throw an error if preferred
  }
}

export function isFileTypeAllowed(file: File, settings: ISettings) {
  const type = getFileType(file.type);
  if (type === null) return false;
  return settings.allowedFileTypes.includes(type);
}

export function isIFileInfo(item: IFileInfo | IFolder): item is IFileInfo {
  return (item as IFileInfo).size !== undefined;
}

export function isIFolder(item: IFileInfo | IFolder): item is IFolder {
  return (item as IFolder).filesId !== undefined;
}

export function sortFiles(files: (IFileInfo | IFolder)[], sorting: FileSorting, sortingDirection: SortingDirection): (IFileInfo | IFolder)[] {
  const compareByName = (a: IFileInfo | IFolder, b: IFileInfo | IFolder) => (sortingDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  const compareBySize = (a: IFileInfo | IFolder, b: IFileInfo | IFolder) => {
    const sizeA = isIFileInfo(a) ? a.size : (a as IFolder).totalSize;
    const sizeB = isIFileInfo(b) ? b.size : (b as IFolder).totalSize;
    return sortingDirection === "asc" ? sizeA - sizeB : sizeB - sizeA;
  };

  const compareByRecent = (a: IFileInfo | IFolder, b: IFileInfo | IFolder) => {
    const dateA = isIFileInfo(a) ? a.uploadedAt : (a as IFolder).createdAt;
    const dateB = isIFileInfo(b) ? b.uploadedAt : (b as IFolder).createdAt;
    return sortingDirection === "asc" ? new Date(dateA ?? 0).getTime() - new Date(dateB ?? 0).getTime() : new Date(dateB ?? 0).getTime() - new Date(dateA ?? 0).getTime();
  };

  const compareByType = (a: IFileInfo | IFolder, b: IFileInfo | IFolder) => {
    const aType = isIFileInfo(a) ? a.type : a.isPrivate ? "private" : "shared";
    const bType = isIFileInfo(b) ? b.type : b.isPrivate ? "private" : "shared";
    return sortingDirection === "asc" ? aType.localeCompare(bType) : bType.localeCompare(aType);
  };

  const sorted = [...files].sort((a, b) => {
    if (sorting === "by-name") {
      return compareByName(a, b);
    } else if (sorting === "by-size") {
      return compareBySize(a, b);
    } else if (sorting === "by-recent") {
      return compareByRecent(a, b);
    } else if (sorting === "by-type") {
      return compareByType(a, b);
    }
    return 0;
  });

  return sorted;
}

export function getFileTypeCounts(storage: IStorage, files: IFileInfo[], folder: IFolder | null): { pdf: number; image: number; audio: number } {
  if (folder === null) {
    return {
      pdf: storage.pdfCount,
      image: storage.imageCount,
      audio: storage.audioCount,
    };
  } else {
    const folderFiles = files.filter((file) => file.folderId === folder._id);
    const fileCounts = folderFiles.reduce(
      (acc, file) => {
        if (file.type === "pdf") acc.pdf += 1;
        else if (file.type === "image") acc.image += 1;
        else if (file.type === "audio") acc.audio += 1;
        return acc;
      },
      { pdf: 0, image: 0, audio: 0 }
    );

    return fileCounts;
  }
}

export function getFilteredFiles(files: IFileInfo[], folders: IFolder[], currentFolder: IFolder | null): (IFileInfo | IFolder)[] {
  if (currentFolder) {
    return files.filter((file) => file.folderId === currentFolder._id);
  } else {
    return [...folders, ...files.filter((file) => !file.folderId)];
  }
}

export function checkFileTypes(files: File[], settings: ISettings): boolean {
  for (const file of files) {
    if (!isFileTypeAllowed(file, settings)) {
      return false;
    }
  }
  return true;
}
