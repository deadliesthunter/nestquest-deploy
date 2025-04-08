import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import Button1 from "@/components/Button1";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import TextField from "@/components/TextField";
import { Ionicons } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";

const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };
  const handlesignup = async () => {
    if (!email || !password || !firstname || !lastname) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    } else if (!isChecked as any) {
      Alert.alert("please accept terms and condition");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstname,
          lastname,
        }),
      });

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (response.ok) {
          Alert.alert("Success", data.message);
          onRegister();
        } else {
          Alert.alert("Error", data.error || "Unknown error occurred.");
        }
      } catch (error) {
        console.error("JSON parse error:", error, "Response text:", text);
        Alert.alert("Error", "Invalid server response.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const router =
    useRouter(); /* this is a react lib which will help with some built in functions */
  const [passwordVisible, setPasswordVisible] = useState(false);
  const onRegister = () => {
    router.navigate("/login");
  };
  return (
    <View className="flex-1 justify-center items-center p-5">
      <View className="w-full max-w-md gap-5">
        <Text className="font-bold text-2xl text-center">Sign up</Text>
        <Text className="font-bold text-xl text-center text-slate-500">
          Join us
        </Text>

        <TextInput
          placeholder="First Name"
          className="border h-14 px-5 rounded-lg bg-white"
          value={firstname}
          onChangeText={setFirstname}
        />
        <TextInput
          placeholder="Last Name"
          className="border h-14 px-5 rounded-lg bg-white"
          value={lastname}
          onChangeText={setLastname}
        />

        <TextInput
          placeholder="Email"
          className=" border h-14 px-5 rounded-lg bg-white"
          onChangeText={setEmail}
        ></TextInput>
        <View className="relative">
          <TextInput
            placeholder="Password"
            secureTextEntry={!passwordVisible} // Toggles text visibility
            className=" border h-14 px-5 rounded-lgn bg-white rounded-lg"
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)} // Toggle visibility state
            className="absolute right-4 top-4"
          >
            <Ionicons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"} // Dynamic icon
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="border transform scale-75">
            <Checkbox
              status={isChecked ? "checked" : "unchecked"}
              onPress={handleCheckBoxChange}
            />
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-sm">I agree to the </Text>
            <TouchableOpacity
              onPress={() => console.log("terms and condition")}
              activeOpacity={0.5}
            >
              <Text className="text-blue-700 text-sm">Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button1
          title={"Register"}
          onPress={handlesignup}
          classname={"bg-black  py-3 rounded-full items-center"}
          textclassname="text-white font-bold text-lg"
        ></Button1>
      </View>
      <View className="flex-row items-center justify-center space-x-2 mt-10">
        <Text>Already have an account?</Text>
        <TouchableOpacity activeOpacity={0.5} onPress={onRegister}>
          <Text className="text-blue-700 font-bold">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default signup;
