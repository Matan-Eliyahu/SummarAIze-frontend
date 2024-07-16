// ErrorContext.tsx
import React, { createContext, useState, ReactNode } from "react";
import Error, { ErrorProps } from "../components/Error/Error";
import { AxiosError } from "axios";
import { getMessage } from "../utils/errors";

interface CustomErrorProps {
  error?: AxiosError;
  text?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  secondButtonText?: string;
  onSecondButtonClick?: () => void;
  buttonColor?: "danger" | "create" | "primary" | "secondary";
  secondButtonColor?: "danger" | "create" | "primary" | "secondary";
}

interface ErrorContextProps {
  setAlert: (details: CustomErrorProps) => void;
  clearAlert: () => void;
}

export const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [errorDetails, setErrorDetails] = useState<ErrorProps | null>(null);

  const setAlert = (details: CustomErrorProps) => {
    const { error, text, buttonText, onButtonClick, secondButtonText, onSecondButtonClick, buttonColor, secondButtonColor } = details;

    if (error) {
      setErrorDetails({
        text: getMessage(error) || "Unknown error",
        buttonText: buttonText || "Close",
        onButtonClick: onButtonClick || clearAlert,
        secondButtonText,
        onSecondButtonClick,
        buttonColor,
        secondButtonColor,
      });
    } else {
      setErrorDetails({
        text: text || "",
        buttonText: buttonText || "Close",
        onButtonClick: onButtonClick || clearAlert,
        secondButtonText,
        onSecondButtonClick,
        buttonColor,
        secondButtonColor,
      });
    }
  };
  ``;

  const clearAlert = () => {
    setErrorDetails(null);
  };

  return (
    <ErrorContext.Provider value={{ setAlert, clearAlert }}>
      {children}
      {errorDetails && <Error {...errorDetails} />}
    </ErrorContext.Provider>
  );
};
