import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useWebSocket } from "../hooks/useWebSocket";
import { WS_URL } from "../config/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Chat() {
  const [message, setMessage] = useState("");
  const { messages, connected, sendMessage } = useWebSocket(WS_URL); //this uses the useWebSocket hook to get the messages, connection status and send messages
  //it also passes the WS_URL(link) to the hook to create a websocket connection
  const handleSend = () => {
    if (message.trim()) {
      //this checks if the message is not empty
      sendMessage(message);
      setMessage("");
    }
  };
  useEffect(() => {
    // Check if token exists
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log("Stored token:", token);
    };

    checkToken();
  }, []);

  const renderMessage = (
    { item } //this function is used to render the messages
  ) => (
    <View style={styles.messageContainer}>
      <Text style={styles.username}>{item.sender_name}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        style={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity
          style={[styles.sendButton, !connected && styles.disabled]}
          onPress={handleSend}
          disabled={!connected}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  username: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
