import { View, Text, Vibration, StyleSheet, Button, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import Button1 from "@/components/Button1";

const forgetpas = () => {
  const [email, setEmail] = useState("");
  function handleReset() {
    Alert.alert("Success", `A reset link has been sent to ${email}`);
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View>
        <Text className="font-bold text-3xl fixed">Forgot password ?</Text>
        <View className="pt-4 mr-8">
          <Text className="color-slate-500 text-xl">
            We'll email you a link to reset your password.
          </Text>
        </View>
        <View className="pt-16">
          <TextInput
            placeholder="Email address"
            onChangeText={setEmail}
            autoCapitalize="none" // Prevent auto capitalization
            placeholderTextColor="#64748b"
            style={styles.textInput}
          />
          <View className="pt-8">
            <Button1
              title="Reset"
              classname="bg-black py-3 rounded-full items-center"
              onPress={handleReset}
              textclassname="text-white font-bold text-lg"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default forgetpas;

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderBottomWidth: 0.2,
    borderBottomColor: "#808c9f", // Slate 500 color
    backgroundColor: "#f3f3f2", // Match the outside background color
    color: "black",
    fontWeight: "bold",
    marginTop: 20,
    paddingHorizontal: 10,
  },
});
