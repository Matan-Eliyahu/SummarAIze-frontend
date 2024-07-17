import React, { createContext, ReactNode } from "react";
import { IAuth, IUser } from "../common/types";
import useAuthentication from "../hooks/useAuthenticatio";
import { CredentialResponse } from "@react-oauth/google";

interface AuthContextType {
  auth: IAuth | null;
  register: (user: IUser) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleSignin: (credential: CredentialResponse) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuthentication();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthContext;
