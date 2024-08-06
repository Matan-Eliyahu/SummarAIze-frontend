import { useState, useEffect } from "react";
import { BASE_URL } from "../services/apiClient";
import { useAuth } from "./useAuth";

const useWebSocket = () => {
  const { auth } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!auth) return;

    const initializeWebSocket = () => {
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

      return ws;
    };

    const ws = initializeWebSocket();

    return () => {
      if (ws.readyState === 1) ws.close();
    };
  }, [auth]);

  return socket;
};

export default useWebSocket;
