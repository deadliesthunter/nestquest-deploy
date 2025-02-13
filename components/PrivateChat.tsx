/* 
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function PrivateChat() {
  // State for search and conversation lists
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [myuser_id, setmyuser_id] = useState("");
  const [senderuser_id, setsenderuser_id] = useState("");
  const [conversationsList, setConversationsList] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");

  const ws = useRef<WebSocket | null>(null);
  const flatListRef = useRef<FlatList<Message>>(null);
  useEffect(() => {
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100); // Delay to ensure DOM updates
  }, [messages]);

  // Initialize WebSocket for real-time messaging
  useEffect(() => {
    const initWebSocket = async () => {
      const token = await AsyncStorage.getItem("token");
      const baseWsUrl =
        Platform.OS === "android"
          ? "ws://10.0.2.2:8000"
          : "ws://127.0.0.1:8000";

      ws.current = new WebSocket(
        `${baseWsUrl}/ws/private-chat/?token=${token}`
      );

      ws.current.onopen = () => console.log("WebSocket connected");
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        if (selectedUser) {
          setMessages((prev) => [
            ...prev,
            {
              message: data.message,
              sender: data.sender_name,
              timestamp: data.timestamp,
            },
          ]);
        }
      };
      ws.current.onerror = (error) => console.error("WebSocket error:", error);
      ws.current.onclose = () => console.log("WebSocket closed");
    };

    initWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [selectedUser]);

  useEffect(() => {
    loadConversationsList
    ();
  }, []);

  // Auto-scroll to the latest message in a conversation
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Load conversation threads (recent conversations)
  const loadConversationsList= async () => {
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
        console.log("ConversationsList data:", data); // Debug log
        setConversationsList(data);
      }
    } catch (error) {
      console.error("Error loading conversations", error);
    }
  };

  // Search for new users to start or continue a conversation
  const fetchUsers = async (query: string) => {
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
        const myuserid =await AsyncStorage.getItem("userid");
        setmyuser_id(myuserid);

        setSearchResults(data);
        console.log("Search results:", data); // Debug log
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // Load the full conversation for a selected user
  const loadConversation = async (userId: string | number) => {
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
        console.log("selected user sssss Conversation data:", data); // Debug log
        setMessages(
          data.map((msg: any) => ({
            message: msg.message,
            sender: msg.sender_name || msg.sender,
            sender_id: msg.sender_id,
            timestamp: msg.timestamp,
          }))

        );
      }
    } catch (error) {
      console.error("Error loading conversation", error);
    }
  };

  // When a user is selected either from search or conversation lists
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    console.log("selected user:", user); // Debug log
    loadConversation(user.user_id);
  };

  // Send a message via WebSocket
  const handleSendMessage = () => {
    if (messageText.trim() && selectedUser) {
      if (ws.current?.readyState === WebSocket.OPEN) {
        const payload = {
          message: messageText,
          receiver_id: selectedUser.user_id,
        };
        ws.current.send(JSON.stringify(payload));
        setMessageText("");
      } else {
        console.warn("WebSocket is not connected, message not sent");
      }
    }
  };

  // Render functions for the different lists
  const renderRecentItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => handleSelectUser(item)}
    >
     // <Text style={styles.recentName}>{item.sender_name}</Text> 
    </TouchableOpacity>
  );

  const renderConversationList = ({ item }: { item}) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleSelectUser(item)}
    >
      <Text style={styles.conversationTitle}>{item.firstname}</Text>
      <Text style={styles.conversationLastMessage}>{item.latest_message}</Text>
      <Text style={styles.conversationTimestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleSelectUser(item)}
    >
      <Text style={styles.userName}>{item.firstname}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </TouchableOpacity>
  );
  useEffect(() => {
    const fetchMYUserId = async () => {
      const myuserid = await AsyncStorage.getItem("userid");
      if (myuserid) {
        setmyuser_id(myuserid);
      }
    };
    fetchMYUserId();
  }, []);


  const renderMessageItem = ({ item }: { item: Message }) => {
    const isSent =item.sender_id === myuser_id ; // Replace with your authentication logic

console.log("myuser_id",myuser_id);
console.log("from other side myuser_id",senderuser_id);
    return (
      <View
        style={[
          styles.messageItem,
          isSent ? styles.messageSent : styles.messageReceived,
        ]}
      >
        {!isSent && <Text style={styles.messageSender}>{item.sender}</Text>}
        <Text style={[styles.messageText, isSent && styles.messageSentText]}>
          {item.message}
        </Text>
        <Text
          style={[
            styles.messageTimestamp,
            isSent && { color: "#E3F2FD", textAlign: "right" },
            !isSent && { textAlign: "left" },
          ]}
        >
          {item.timestamp}
        </Text>
      </View>
    );
  };
  // Render full conversation view if a conversation is selected
  if (selectedUser) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.fullConversationContainer}
      >
        <View style={styles.chatHeader}>
          <Text style={styles.chatHeaderText}>
            Chat with {selectedUser.firstname}
          </Text>
          <TouchableOpacity onPress={() => (setSelectedUser(null),setsenderuser_id(""))}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          //keyExtractor={(_, idx) => idx.toString()}
          style={styles.messagesList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Otherwise, render the chat home view with search and conversation lists
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search people..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            if (text.trim()) {
              fetchUsers(text);
            } else {
              setSearchResults([]);
              loadConversationsList
              ();
            }
          }}
        />
      </View>
      {searchQuery.trim() ? (
        <FlatList
          data={searchResults}
          renderItem={renderUserItem}
          //keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <FlatList
          data={conversationsList}
          renderItem={renderConversationList}
         // keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <Text style={styles.sectionHeader}>Recent Conversations</Text>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  fullConversationContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
  },
  searchInput: {
    height: 48,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#212121",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userItem: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEEEEE",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#757575",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9E9E9E",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FAFAFA",
    textTransform: "uppercase",
  },
  conversationItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEEEEE",
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  conversationLastMessage: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  conversationTimestamp: {
    fontSize: 12,
    color: "#BDBDBD",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chatHeaderText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212121",
  },
  backButton: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "500",
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageItem: {
    maxWidth: "80%",
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
  },
  messageSent: {
    alignSelf: "flex-end",
    backgroundColor: "lightblue",
    borderBottomRightRadius: 10,
  },
  messageReceived: {
    alignSelf: "flex-start",
    backgroundColor: "lightgreen",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: "#212121",
  },
  messageSentText: {
    color: "#FFFFFF",
    textAlign: "right",
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: "500",
    color: "#757575",
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#212121",
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: "#2196F3",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  recentItem: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEEEEE",
  },
  recentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
}); */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import useChatStore from "@/store/chatstore";

export default function PrivateChat() {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    conversationsList,
    selectedUser,
    setSelectedUser,
    messages,
    messageText,
    setMessageText,
    ws,
    loadConversationsList,
    fetchUsers,
    loadConversation,
    handleSendMessage,
    initializeWebSocket,
  } = useChatStore();

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadConversationsList();
    initializeWebSocket();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100); // Delay to ensure DOM updates
  }, [messages]);

  const renderRecentItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleSelectUser(item)}>
      <Text>{item.sender_name}</Text>
    </TouchableOpacity>
  );

  const renderConversationList = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleSelectUser(item)}>
      <Text className="bg-blue-300">{item.firstname}</Text>
      <Text>{item.latest_message}</Text>
      <Text>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleSelectUser(item)}>
      <Text>{item.firstname}</Text>
      <Text>{item.email}</Text>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: any }) => {
    const isSent = item.sender_id === useChatStore.getState().myuser_id;

    return (
      <View>
        {!isSent && <Text>{item.sender}</Text>}
        <Text>{item.message}</Text>
        <Text>{item.timestamp}</Text>
      </View>
    );
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    console.log("selected user:", user.user_id); // Debug log
    loadConversation(user.user_id);
  };

  if (selectedUser) {
    return (
      <View style={styles.fullConversationContainer}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedUser(null)}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.chatHeaderText}>Chat with {selectedUser.firstname}</Text>
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={renderMessageItem}
          style={styles.messagesList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            if (text.trim()) {
              fetchUsers(text);
            } else {
              setSearchResults([]);
              loadConversationsList();
            }
          }}
          placeholder="Search users..."
          style={styles.searchInput}
        />
      </View>
      {searchQuery.trim() ? (
        <FlatList
          data={searchResults}
         // keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
        />
      ) : (
        // ============================ conversationList render ============================
        <FlatList
          data={conversationsList}
          //keyExtractor={(item) => item.id.toString()}
          renderItem={renderConversationList}
          ListHeaderComponent={<Text style={styles.sectionHeader}>Recent Conversations</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  fullConversationContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
  },
  searchInput: {
    height: 48,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#212121",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9E9E9E",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FAFAFA",
    textTransform: "uppercase",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chatHeaderText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212121",
  },
  backButton: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "500",
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#212121",
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: "#2196F3",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});