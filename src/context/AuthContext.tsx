import React, { createContext, ReactNode, useState, useEffect } from "react";
import { IAuth, IUser } from "../common/types";
import AuthService, { AxiosError } from "../services/AuthService";
import { clearLocalStorageAuth, getLocalStorageAuth, setLocalStorageAuth } from "../utils/localStorage";
import { TokenResponse } from "@react-oauth/google";
import { useAlert } from "../hooks/useAlert";

interface AuthContextType {
  auth: IAuth | null;
  loadingAuth: boolean;
  loadingLogout: boolean;
  register: (user: IUser) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (tokenResponse: TokenResponse) => Promise<{ initialized: boolean; error: boolean }>;
  facebookLogin: (accessToken: string) => Promise<{ initialized: boolean; error: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setAlert } = useAlert();
  const [auth, setAuth] = useState<IAuth | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  useEffect(() => {
    const storedAuth = getLocalStorageAuth();
    if (storedAuth && storedAuth.isInitialized) {
      setAuth(storedAuth);
    }
  }, []);

  async function register(user: IUser) {
    const { request } = AuthService.register(user);
    setLoadingAuth(true);
    try {
      await request;
    } catch (error) {
      console.error("Register error:", error);
      if (error instanceof AxiosError) setAlert({ error });
    } finally {
      setLoadingAuth(false);
    }
  }

  async function login(email: string, password: string) {
    const { request } = AuthService.login(email, password);
    setLoadingAuth(true);
    try {
      const response = await request;
      const auth: IAuth = response.data;
      setLocalStorageAuth(auth);
      setAuth(auth);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof AxiosError) {
        console.error("axios error!!!!");
        setAlert({ error });
      }
      setLoadingAuth(false);
    } finally {
      setLoadingAuth(false);
    }
  }

  async function googleLogin(tokenResponse: TokenResponse) {
    const { request } = AuthService.googleLogin(tokenResponse);
    setLoadingAuth(true);
    try {
      const response = await request;
      const auth: IAuth = response.data;
      setLocalStorageAuth(auth);
      if (!auth.isInitialized) {
        return { initialized: false, error: false };
      } else {
        setAuth(auth);
        return { initialized: true, error: false };
      }
    } catch (error) {
      console.error("Google login error:", error);
      if (error instanceof AxiosError) setAlert({ error });
      return { initialized: false, error: true };
    } finally {
      setLoadingAuth(false);
    }
  }

  async function facebookLogin(accessToken: string) {
    const { request } = AuthService.facebookLogin(accessToken);
    setLoadingAuth(true);
    try {
      const response = await request;
      console.log("Auth: ", response.data);
      const auth: IAuth = response.data;
      setLocalStorageAuth(auth);
      if (!auth.isInitialized) {
        return { initialized: false, error: false };
      } else {
        setAuth(auth);
        return { initialized: true, error: false };
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      if (error instanceof AxiosError) setAlert({ error });
      return { initialized: false, error: true };
    } finally {
      setLoadingAuth(false);
    }
  }

  async function logout() {
    const { request } = AuthService.logout();
    setLoadingLogout(true);
    if (auth) {
      try {
        await request;
        clearLocalStorageAuth();
        setAuth(null);
      } catch (error) {
        console.error("Logout error:", error);
        if (error instanceof AxiosError) setAlert({ error });
      } finally {
        setLoadingLogout(false);
      }
    }
  }

  return <AuthContext.Provider value={{ auth, loadingAuth, loadingLogout, register, login, googleLogin, facebookLogin, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
