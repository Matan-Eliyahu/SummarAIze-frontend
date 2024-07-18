import React, { createContext, ReactNode, useState, useEffect } from "react";
import { IAuth, IUser } from "../common/types";
import AuthService, { AxiosError } from "../services/AuthService";
import { clearLocalStorageAuth, getLocalStorageAuth, setLocalStorageAuth } from "../utils/localStorage";
import { TokenResponse } from "@react-oauth/google";

interface AuthContextType {
  auth: IAuth | null;
  loadingAuth: boolean;
  register: (user: IUser) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (tokenResponse: TokenResponse) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<IAuth | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {
    const storedTokens = getLocalStorageAuth();
    if (storedTokens) {
      setAuth(storedTokens);
    }
  }, []);

  async function register(user: IUser) {
    setLoadingAuth(true);
    try {
      const { request } = AuthService.register(user);
      await request;
    } catch (error) {
      console.error("Register error:", error);
      if (error instanceof AxiosError) throw error;
    } finally {
      setLoadingAuth(false);
    }
  }

  async function login(email: string, password: string) {
    setLoadingAuth(true);
    try {
      const { request } = AuthService.login(email, password);
      const response = await request;
      const auth: IAuth = response.data;
      setLocalStorageAuth(auth);
      setAuth(auth);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof AxiosError) throw error;
    } finally {
      setLoadingAuth(false);
    }
  }

  async function googleLogin(tokenResponse: TokenResponse) {
    setLoadingAuth(true);
    try {
      const { request } = AuthService.googleLogin(tokenResponse);
      const response = await request;
      const auth: IAuth = response.data;
      setLocalStorageAuth(auth);
      setAuth(auth);
    } catch (error) {
      console.error("Google login error:", error);
      if (error instanceof AxiosError) throw error;
    } finally {
      setLoadingAuth(false);
    }
  }

  async function logout() {
    setLoadingAuth(true);
    if (auth) {
      try {
        const { request } = AuthService.logout();
        await request;
        clearLocalStorageAuth();
        setAuth(null);
      } catch (error) {
        console.error("Logout error:", error);
        if (error instanceof AxiosError) throw error;
      } finally {
        setLoadingAuth(false);
      }
    }
  }

  return <AuthContext.Provider value={{ auth, loadingAuth, register, login, googleLogin, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
