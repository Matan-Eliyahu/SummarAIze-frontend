import { IAuth } from "../common/types";


export function getLocalStorageAuth(): IAuth | null {
  const storedTokens = localStorage.getItem("auth");
  if (storedTokens) {
    const parsedTokens: IAuth = JSON.parse(storedTokens);
    return parsedTokens;
  } else return null;
}

export function setLocalStorageAuth(auth: IAuth) {
  localStorage.setItem("auth", JSON.stringify(auth));
}

export function clearLocalStorageAuth() {
  localStorage.removeItem("auth");
}
