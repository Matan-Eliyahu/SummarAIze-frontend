export interface IUser {
  fullName: string;
  plan: PlanType;
  email: string;
  password: string;
  imageUrl: string;
  refreshTokens?: string[];
  _id?: string;
}

export interface IAuth {
  userId: string;
  plan: PlanType;
  fullName: string;
  email: string;
  imageUrl: string;
  tokens: ITokens;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export type FileType = "pdf" | "image" | "audio";
export const fileTypes = ["pdf", "image", "audio"];

export type FileListView = "list" | "icons" | "recent";

export interface ISettings {
  userId: string;
  allowedFileTypes: FileType[];
  autoSummarizeEnabled: boolean;
  smartSearchEnabled: boolean;
  clearFilesAfterDays: 0 | 30 | 60 | 90;
  defaultFileView: FileListView;
  summaryOptions: ISummaryOptions;
  _id?: string;
}

export type FileStatus = "completed" | "processing" | "error" | "not-summarized";

export interface IFile {
  userId: string;
  name: string;
  type: FileType;
  size: number;
  path: string;
  transcribe: string;
  summary: string;
  title: string;
  keywords: string[];
  status: FileStatus;
  uploadedAt: Date;
  lastOpened?: Date;
  _id?: string;
}

export interface IStorage {
  totalSize: number;
  pdfCount: number;
  imageCount: number;
  audioCount: number;
  lastOpened: string[];
}

export interface IUpdate {
  fileName: string;
  status: FileStatus;
}

export type PlanType = "basic" | "pro" | "premium" | "none";

export interface IPlan {
  type: PlanType;
  description: string;
  price: number;
  maxStorageInMb: number;
  enableSharedFiles: boolean;
}

export const PLANS: Record<PlanType, IPlan | null> = {
  basic: {
    type: "basic",
    description:
      "Ideal for casual users, the Basic Plan offers essential features for everyday needs, including basic text extraction and summarization services. Get started with a limited number of file uploads and enjoy core functionalities without any additional cost.",
    price: 0,
    maxStorageInMb: 100,
    enableSharedFiles: false,
  },
  pro: {
    type: "pro",
    description:
      "Designed for power users, the Pro Plan provides enhanced capabilities such as shared files, increased file upload limits, faster processing times, and advanced summarization options. Perfect for professionals seeking more robust performance and additional features to streamline their workflow.",
    price: 5,
    maxStorageInMb: 500,
    enableSharedFiles: true,
  },
  premium: {
    type: "premium",
    description:
      "The ultimate package for heavy users and organizations, the Premium Plan includes all the features of the Pro Plan plus priority support, the highest file upload limits, and exclusive access to premium features. Experience the best our service has to offer with maximum efficiency and dedicated assistance.",
    price: 10,
    maxStorageInMb: 1000,
    enableSharedFiles: true,
  },
  none: null,
};

export type Language = "auto" | "english" | "spanish" | "french" | "german" | "chinese" | "japanese" | "korean" | "russian" | "arabic" | "portuguese" | "italian" | "hindi" | "bengali";

export interface ISummaryOptions {
  length: "short" | "medium" | "long";
  language: Language;
  tone: "formal" | "informal" | "neutral";
  detailLevel: "high" | "medium" | "low";
  keywords: string[];
}

export const summaryToneOptions = [
  { value: "formal", label: "Formal" },
  { value: "informal", label: "Informal" },
  { value: "neutral", label: "Neutral" },
];

export const summaryLanguageOptions: { value: Language; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "russian", label: "Russian" },
  { value: "arabic", label: "Arabic" },
  { value: "portuguese", label: "Portuguese" },
  { value: "italian", label: "Italian" },
  { value: "hindi", label: "Hindi" },
  { value: "bengali", label: "Bengali" },
];
