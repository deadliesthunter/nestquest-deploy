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

interface User {
  id: string | number;
  firstname: string;
  email?: string;
}

interface Message {
  message: string;
  sender: string; // Replace with actual user ID logic
  timestamp: string;
}

interface Conversation {
  id: string | number;
  partner: User;
  last_message: string;
  timestamp: string;
}

export default function TelegramMessenger() {
  // State for search and conversation lists
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");

  const flatListRef = useRef<FlatList<Message> | null>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Simulate loading conversations
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    // Simulated API call for recent conversations
    setTimeout(() => {
      setConversations([
        {
          id: 1,
          partner: { id: 1, firstname: "Alice", email: "alice@example.com" },
          last_message: "Hey, how are you?",
          timestamp: "10:30 AM",
        },
        {
          id: 2,
          partner: { id: 2, firstname: "Bob", email: "bob@example.com" },
          last_message: "See you later!",
          timestamp: "Yesterday",
        },
      ]);
    }, 500);
  };

  // Simulate searching for users
  const fetchUsers = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Simulated API call for user search
    setTimeout(() => {
      setSearchResults([
        { id: 3, firstname: "Charlie", email: "charlie@example.com" },
        { id: 4, firstname: "Diana", email: "diana@example.com" },
      ]);
    }, 500);
  };

  // Simulate loading a conversation
  const loadConversation = (userId: string | number) => {
    // Simulated API call for conversation history
    setTimeout(() => {
      setMessages([
        {
          message: "Hello!",
          sender: "current_user_id", // Replace with actual user ID logic
          timestamp: "10:25 AM",
        },
        {
          message: "Hi there!",
          sender: userId.toString(),
          timestamp: "10:26 AM",
        },
      ]);
    }, 500);
  };

  // Handle selecting a user
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    loadConversation(user.id);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (messageText.trim() && selectedUser) {
      const newMessage: Message = {
        message: messageText,
        sender: "current_user_id", // Replace with actual user ID logic
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessageText(""); // Clear input
    }
  };

  // Render functions
  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity onPress={() => handleSelectUser(item.partner)}>
      <View style={styles.conversationItem}>
        <Text style={styles.conversationTitle}>{item.partner.firstname}</Text>
        <Text style={styles.conversationLastMessage}>{item.last_message}</Text>
        <Text style={styles.conversationTimestamp}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity onPress={() => handleSelectUser(item)}>
      <View style={styles.userItem}>
        <Text style={styles.userName}>{item.firstname}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isSent = item.sender === "current_user_id"; // Replace with actual user ID logic
console.log('isSent',"dkjfdjfklslkjflsjk")
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
        <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  // Full conversation view
  if (selectedUser) {
    return (
      <View style={styles.fullConversationContainer}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedUser(null)}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.chatHeaderText}>Chat with {selectedUser.firstname}</Text>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messagesList}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message"
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Chat home view
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            if (text.trim()) {
              fetchUsers(text);
            } else {
              setSearchResults([]);
            }
          }}
          placeholder="Search users"
          style={styles.searchInput}
        />
      </View>

      {/* Search Results or Recent Conversations */}
      {searchQuery.trim() ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
        />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderConversationItem}
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
    flexGrow: 1,
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
    backgroundColor: "#2196F3",
    borderBottomRightRadius: 4,
  },
  messageReceived: {
    alignSelf: "flex-start",
    backgroundColor: "#F5F5F5",
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
    maxHeight: 100},
});