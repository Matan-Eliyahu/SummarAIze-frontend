import { FileType } from "../common/types";

export function getFileType(mimeType: string): FileType {
  if (mimeType.startsWith("image/")) {
    return "image";
  } else if (mimeType.startsWith("audio/")) {
    return "audio";
  } else if (mimeType === "application/pdf") {
    return "pdf";
  } else {
    throw new Error("Unsupported file type.");
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
