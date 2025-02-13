import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

interface User {
  id: string | number;
  firstname: string;
  email?: string;
}

interface Message {
  message: string;
  sender_id?: string;
  sender: string;
  timestamp: string;
}

interface Conversation {
  id: string | number;
  sender_name: User;
  last_message: string;
  timestamp: string;
}

interface ChatState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  searchResults: User[];
  setSearchResults: (results: User[]) => void;

  myuser_id: string;
  setmyuser_id: (id: string) => void;

  senderuser_id: string;
  setsenderuser_id: (id: string) => void;

  conversationsList: Conversation[];
  setConversationsList: (list: Conversation[]) => void;

  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;

  messages: Message[];
  setMessages: (messages: Message[]) => void;

  messageText: string;
  setMessageText: (text: string) => void;

  ws: WebSocket | null;
  setWs: (ws: WebSocket | null) => void;
  loadConversationsList: () => Promise<void>;
  fetchUsers: (query: string) => Promise<void>;
  loadConversation: (userId: string | number) => Promise<void>;
  handleSendMessage: () => void;
  initializeWebSocket: () => void;
}

const useChatStore = create<ChatState>((set, get) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  myuser_id: "",
  setmyuser_id: (id) => set({ myuser_id: id }),
  senderuser_id: "",
  setsenderuser_id: (id) => set({ senderuser_id: id }),
  conversationsList: [],
  setConversationsList: (list) => set({ conversationsList: list }),
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  messageText: "",
  setMessageText: (text) => set({ messageText: text }),
  ws: null,
  setWs: (ws) => set({ ws }),

  // Load conversation threads (recent conversations)
  loadConversationsList: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const baseUrl =
        Platform.OS === "android"
          ? "http://10.0.2.2:8000"
          : "http://127.0.0.1:8000";
      const response = await fetch(`${baseUrl}/api/messages/conversation/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({ conversationsList: data });
      }
    } catch (error) {
      console.error("Error loading conversations", error);
    }
  },

  // Search for new users to start or continue a conversation
  fetchUsers: async (query: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const baseUrl =
        Platform.OS === "android"
          ? "http://10.0.2.2:8000"
          : "http://127.0.0.1:8000";
      const response = await fetch(
        `${baseUrl}/api/users/search/?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        set({ searchResults: data });
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  },

  // Load the full conversation for a selected user
  loadConversation: async (userId: string | number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const baseUrl =
        Platform.OS === "android"
          ? "http://10.0.2.2:8000"
          : "http://127.0.0.1:8000";
      const response = await fetch(
        `${baseUrl}/api/messages/search/?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        set({
          messages: data.map((msg: any) => ({
            message: msg.message,
            sender: msg.sender_name || msg.sender,
            sender_id: msg.sender_id,
            timestamp: msg.timestamp,
          })),
        });
      }
    } catch (error) {
      console.error("Error loading conversation", error);
    }
  },

  // Send a message via WebSocket
  handleSendMessage: () => {
    console.log("Sending message");
    const { messageText, selectedUser, ws, setMessageText } = get();
    if (messageText.trim() && selectedUser) {
      if (ws?.readyState === WebSocket.OPEN) {
        const payload = {
          message: messageText,
          receiver_id: selectedUser.id,
        };
        ws.send(JSON.stringify(payload));
        setMessageText("");
      } else {
        console.warn("WebSocket is not connected, message not sent");
      }
    }
  },

  // Initialize WebSocket for real-time messaging
  initializeWebSocket: () => {
    console.log("Initializing WebSocket");
    const { setWs } = get();
    const initWebSocket = async () => {
      const token = await AsyncStorage.getItem("token");
      const baseWsUrl =
        Platform.OS === "android"
          ? "ws://10.0.2.2:8000"
          : "ws://127.0.0.1:8000";
      const wsInstance = new WebSocket(
        `${baseWsUrl}/ws/private-chat/?token=${token}`
      );

      wsInstance.onopen = () => console.log("WebSocket connected");
      wsInstance.onmessage = (event) => {
        const data = JSON.parse(event.data);
        set((state) => ({
          messages: [
            ...state.messages,
            {
              message: data.message,
              sender: data.sender_name,
              timestamp: data.timestamp,
            },
          ],
        }));
      };
      wsInstance.onerror = (error) => console.error("WebSocket error:", error);
      wsInstance.onclose = () => console.log("WebSocket closed");

      setWs(wsInstance);
    };

    initWebSocket();
  },
}));

export default useChatStore;