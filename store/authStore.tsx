import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

let API_BASE_URL = "";

// Determine API base URL based on environment

const LOCAL_IP = "127.0.0.1"; // Replace with your local IP
API_BASE_URL = "http://127.0.0.1:8000/api"; // Android (Emulator & Device)

export { API_BASE_URL };
interface AuthStore {
  user: User; // Replace 'User' with the actual type of your user object
  isAuthenticated: boolean;
  logout: () => void;
}

// Zustand Store for Authentication
const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  // Login action
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          loading: false,
        });
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userid", data.user.id);
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Logout action
  logout: async () => {
    try {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
      await AsyncStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // Initialize authentication on app startup
  initializeAuth: async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        set({ token: storedToken, isAuthenticated: true });
        const response = await fetch(`${API_BASE_URL}/user/`, {
          headers: {
            Authorization: `Token ${storedToken}`, // Ensure "Token" prefix
          },
        });
        if (response.ok) {
          const userData = await response.json();
          set({ user: userData });
        } else {
          console.warn("Token expired or invalid");
          get().logout(); // Call logout if token is invalid
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      set({ loading: false }); // Ensure loading state is cleared
    }
  },
}));

export default useAuthStore;
