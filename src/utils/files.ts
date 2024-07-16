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
