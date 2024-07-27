import { useState, useEffect } from "react";
import { BASE_URL } from "../services/apiClient";
import { useAuth } from "./useAuth";

const useWebSocket = () => {
  const { auth } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    if (!auth) return;
    const ws = new WebSocket(`${BASE_URL}?userId=${auth.userId}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    return () => {
      ws.close();
    };
  }, [auth]);

  return socket;
};

export default useWebSocket;
