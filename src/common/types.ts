export interface IUser {
  fullName: string;
  email: string;
  password: string;
  imageUrl: string;
  refreshTokens?: string[];
}

export interface IAuth {
  id: string;
  fullName: string;
  email: string;
  imageUrl: string;
  tokens: ITokens;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface ISummaryData {
  summarizedText: string;
  adjustment?: string;
  fileName: string;
  type: string;
}

export type FileType = "pdf" | "image" | "audio";
export const fileTypes = ["pdf", "image", "audio"];

export interface ISettings {
  userId: string;
  allowedFileTypes: FileType[];
  autoSummarizeEnabled: boolean;
  smartSearchEnabled: boolean;
  clearFilesAfterDays: 0 | 30 | 60 | 90;
}

export type FileStatus = "completed" | "processing" | "error" | "unprocessed";

export interface IFile {
  userId: string;
  name: string;
  type: FileType;
  size: number;
  transcribe: string;
  summary: string;
  status: FileStatus;
  uploadedAt: Date;
}

export interface IStorage {
  totalSize: number;
  pdfCount: number;
  imageCount: number;
  audioCount: number;
}
