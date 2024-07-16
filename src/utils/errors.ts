import { AxiosError } from "axios";

export function getMessage(error: AxiosError) {
  return error.response ? (error.response.data as string) : error.message;
}
