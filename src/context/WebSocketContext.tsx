import React, { createContext, useState, useEffect } from "react";
import { BASE_URL } from "../services/apiClient";
import { useAuth } from "../hooks/useAuth";

interface WebSocketContextValue {
  socket: WebSocket | null;
}

export const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!auth) return;

    const ws = new WebSocket(`${BASE_URL}?userId=${auth.userId}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
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
  }, [auth]);

  return <WebSocketContext.Provider value={{ socket }}>{children}</WebSocketContext.Provider>;
};
