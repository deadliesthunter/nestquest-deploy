import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Message = {
  type: string;
  message: string;
  sender_name: string;
  receiver_id?: number; // Add receiver_id for private messages
  timestamp?: string; // Add timestamp
};

export const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("WebSocket connecting with token:", token);
      const wsUrl = `${url}?token=${token}`;

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("Connected to WebSocket");
        setConnected(true);
      };

      ws.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          console.log("Received message:", data);
          setMessages((prev) => [...prev, data]);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      ws.current.onclose = () => {
        console.log("Disconnected from WebSocket");
        setConnected(false);
        // Attempt to reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(connect, 3000);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      // Attempt to reconnect after 3 seconds
      reconnectTimeout.current = setTimeout(connect, 3000);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: string, receiverId?: number) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const payload = receiverId
        ? { message, receiver_id: receiverId }
        : { message };

      ws.current.send(JSON.stringify(payload));
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  return {
    messages,
    connected,
    sendMessage,
    reconnect: connect, // Expose reconnect function
  };
};
