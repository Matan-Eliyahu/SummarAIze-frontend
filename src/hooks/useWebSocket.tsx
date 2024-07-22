import { useState, useEffect } from "react";

const useWebSocket = (url: string, userId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${url}?userId=${userId}`);
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
  }, [url,userId]);

  return socket;
};

export default useWebSocket;
