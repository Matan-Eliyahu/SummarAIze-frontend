import React, { createContext, useState, ReactNode } from "react";
import Error, { ErrorProps } from "../components/Error/Error";
import { AxiosError } from "axios";
import { getMessage } from "../utils/errors";
import Modal from "../components/Modal/Modal";

interface CustomErrorProps {
  error?: AxiosError;
  text?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  secondButtonText?: string;
  onSecondButtonClick?: () => void;
  buttonColor?: "danger" | "create" | "primary" | "secondary" | "cancel";
  secondButtonColor?: "danger" | "create" | "primary" | "secondary" | "cancel";
  icon?: "error" | "upload";
}

interface AlertContextProps {
  setAlert: (details: CustomErrorProps) => void;
  clearAlert: () => void;
  setModal: (element: ReactNode) => void;
  clearModal: () => void;
}

export const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [errorDetails, setErrorDetails] = useState<ErrorProps | null>(null);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  function setAlert(details: CustomErrorProps) {
    const { error, text, buttonText, onButtonClick, secondButtonText, onSecondButtonClick, buttonColor, secondButtonColor, icon } = details;

    if (error) {
      setErrorDetails({
        text: getMessage(error) || "Unknown error",
        buttonText: buttonText || "Close",
        onButtonClick: onButtonClick || clearAlert,
        secondButtonText,
        onSecondButtonClick,
        buttonColor,
        secondButtonColor,
        icon: icon || "error",
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
        icon: icon || "error",
      });
    }
  }

  function clearAlert() {
    setErrorDetails(null);
  }

  function setModal(element: ReactNode) {
    setModalContent(element);
  }

  function clearModal() {
    setModalContent(null);
  }

  return (
    <AlertContext.Provider value={{ setAlert, clearAlert, setModal, clearModal }}>
      {children}
      {errorDetails && <Error {...errorDetails} />}
      {modalContent && <Modal element={modalContent} />}
    </AlertContext.Provider>
  );
};
