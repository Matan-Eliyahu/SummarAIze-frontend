import { useState, useEffect } from "react";
import AuthService, { AxiosError } from "../services/AuthService";
import { IAuth, IUser } from "../common/types";
import { useError } from "./useError";
import { clearLocalStorageAuth, getLocalStorageAuth, setLocalStorageAuth } from "../utils/localStorage";
import { TokenResponse } from "@react-oauth/google";

export interface ExtendedAuth extends IAuth {
  expirationDate: Date;
}

const useAuthentication = () => {
  const { setAlert } = useError();
  const [auth, setAuth] = useState<IAuth | null>(null);

  useEffect(() => {
    const storedTokens = getLocalStorageAuth();
    if (storedTokens) {
      setAuth(storedTokens);
    }
  }, []);

  async function register(user: IUser) {
    try {
      const { request } = AuthService.register(user);
      await request;
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      console.error("Register error:", error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const { request } = AuthService.login(email, password);
      const reponse = await request;
      if (!auth) {
        const auth: IAuth = reponse.data;
        setLocalStorageAuth(auth);
        setAuth(auth);
      }
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      console.error("Login error:", error);
      throw error;
    }
  }

  async function googleLogin(tokenResponse: TokenResponse) {
    try {
      const { request } = AuthService.googleLogin(tokenResponse);
      const response = await request;
      const auth: IAuth = response.data;
      setLocalStorageAuth(auth);
      setAuth(auth);
    } catch (error) {
      if (error instanceof AxiosError) setAlert({ error });
      console.error("Google singin error:", error);
      throw error;
    }
  }

  async function logout() {
    if (auth) {
      try {
        const { request } = AuthService.logout();
        await request;
        clearLocalStorageAuth();
        setAuth(null);
      } catch (error) {
        console.error("Logout error:", error);
        if (error instanceof AxiosError) setAlert({ error });
        throw error;
      }
    }
  }

  return { auth, register, login, logout, googleLogin };
};

export default useAuthentication;
