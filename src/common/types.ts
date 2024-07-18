export type FormType = {
  formId: string;
  elements: InputFormElement[];
  confirmButton: {
    text: string;
    className: string;
    handler: (formData: { [key: string]: string }) => void;
  };
};

export type InputFormElement = {
  label: string;
  name: string;
  type: string;
  autocomplete?: string;
};

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  imageUrl: string;
  refreshTokens?: string[];
}

export interface IAuth {
  id: string;
  fullName:string;
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
