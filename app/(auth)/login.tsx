import Button1 from "@/components/Button1";
import TextField from "@/components/TextField";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useState, useContext } from "react";
import { AuthContext } from "@/store/authStore";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const { login } = useContext(AuthContext); // Access AuthContext
  const [passwordVisible, setPasswordVisible] = useState(false);
  const PlaceholderImage = require("@/assets/images/google.png");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and Password are required.");
      return;
    }

    try {
      setLoading(true); // Start loading
      await login(email, password); // Login using AuthContext
      setLoading(false); // Stop loading

      Alert.alert("Success", "Logged in successfully!");
      <Redirect href="/"></Redirect>;
    } catch (error) {
      setLoading(false); // Stop loading
      Alert.alert("Error", error.message || "Login failed.");
    }
  };

  const onCreate = () => {
    router.push("/signup");
  };

  const onForgot = () => {
    router.push("/forgetpas");
  };

  const onGoogle = () => {
    router.reload();
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center p-5">
      <View className="w-full max-w-md gap-5">
        <Text className="font-bold text-3xl text-center">NestQuest</Text>
        <Text className="font-bold text-xl text-center text-slate-500">
          Welcome back
        </Text>

        <TextInput
          placeholder="Email"
          className="border h-14 px-5 rounded-lg bg-white"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none" // Prevent auto capitalization
          keyboardType="email-address"
        />

        <View className="relative">
          <TextInput
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            className="border h-14 px-5 rounded-lg bg-white"
            autoCapitalize="none" // Prevent auto capitalization
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <Ionicons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <Button1
            title="Login"
            classname="bg-black py-3 rounded-full items-center"
            onPress={handleLogin}
            textclassname="text-white font-bold text-lg"
          />
        )}

        <View className="w-full max-w-md gap-5">
          <TouchableOpacity activeOpacity={0.5} onPress={onForgot}>
            <Text className="text-right ">Forgot password ?</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-5">
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text className="mx-2 text-gray-500 text-sm">or sign in with</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        {/* Google Sign-In Button */}
        <TouchableOpacity
          className="bg-white border py-3 rounded-full items-center flex-row justify-center space-x-2"
          activeOpacity={0.7}
          onPress={onGoogle}
        >
          <Image
            source={PlaceholderImage}
            className="w-6 h-6"
            style={{ alignSelf: "center", marginTop: 2 }}
          />
          <Text className="text-black text-lg">
            Sign In With <Text className="font-bold">Google</Text>
          </Text>
        </TouchableOpacity>

        {/* Create Account */}
        <TouchableOpacity activeOpacity={0.5} onPress={onCreate}>
          <Text className="text-blue-700 font-bold text-center text-xl">
            Create an account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
