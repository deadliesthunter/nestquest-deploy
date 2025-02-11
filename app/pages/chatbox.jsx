
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PrivateChat from "@/components/PrivateChat";

export default function ChatBox() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PrivateChat />
    </SafeAreaView>
  );
}

