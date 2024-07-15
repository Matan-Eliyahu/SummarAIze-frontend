export type FormType = {
    formId: string
    elements: InputFormElement[]
    confirmButton: {
        text: string
        className: string
        handler: Function
    }
}

export type InputFormElement = {
    label: string
    name: string
    type: string
}

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  refreshTokens?: string[];
}

export interface IAuth {
    userId:string;
    accessToken:string;
    refreshToken:string;
}