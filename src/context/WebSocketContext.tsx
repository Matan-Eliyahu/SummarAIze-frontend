import React, { createContext, useState, useEffect } from "react";
import { BASE_URL } from "../services/apiClient";
import { useAuth } from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { IUpdate } from "../common/types";
import { useAlert } from "../hooks/useAlert";
import { useStore } from "../hooks/useStore";

interface WebSocketContextValue {
  socket: WebSocket | null;
}

export const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  const { refreshStore } = useStore();
  const { setAlert, clearAlert } = useAlert();
  const location = useLocation();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!auth) return;
    const ws = new WebSocket(`${BASE_URL}?userId=${auth.userId}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30 * 1000);
    };

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type && message.type === "pong") return;
      if (location.pathname.includes("account") || location.pathname.includes("settings")) {
        const update: IUpdate = message;
        const text = update.status === "completed" ? `"${update.fileName}" has been successfully processed` : `Processing failed for ${update.fileName}`;
        setAlert({
          text,
          buttonColor: "cancel",
          secondButtonText: "Go to file",
          secondButtonColor: "secondary",
          onSecondButtonClick: () => {
            clearAlert();
            navigate(`/dashboard/${update.fileId}`);
          },
        });
      }
      await refreshStore();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("Disconnected from WebSocket", event);
    };

    return () => {
      if (ws.readyState === 1) ws.close();
    };
  }, [auth, location]);

  return <WebSocketContext.Provider value={{ socket }}>{children}</WebSocketContext.Provider>;
};
