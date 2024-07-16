import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { ErrorProvider } from "./context/ErrorContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorProvider>
  </React.StrictMode>
);
