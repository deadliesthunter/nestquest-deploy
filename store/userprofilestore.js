import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";
import useAuthStore from "./authStore";

let API_BASE_URL = "";

// Determine API base URL based on environment
if (!Constants.expoConfig?.hostUri) {
  API_BASE_URL = "http://127.0.0.1:8000/api"; // Use production API in deployments
} else {
  const LOCAL_IP = "127.0.0.1"; // Replace with your local IP
  API_BASE_URL =
    Platform.OS === "ios"
      ? `http://${LOCAL_IP}:8000/api` // iOS (Simulator & Device)
      : `http://${LOCAL_IP}:8000/api`; // Android (Emulator & Device)
}

export { API_BASE_URL };

const useUserProfileStore = create((set, get) => ({
  posts: [],
  roomprofile:{}, 
  loading: false, 
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null }); 

    try {
      
      const token = useAuthStore.getState().token;
      console.log("Token:", token);

      if (!token) {
        throw new Error("User is not authenticated!");
      }

      const response = await fetch(`${API_BASE_URL}/properties/host/`,{
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`, 
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const user = await response.json();
      set({ posts: user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false }); 
      console.error("Fetch Error:", error);
    }
  },
  fetchRoom:  (roomprofile) => {
      set({ roomprofile: roomprofile });
  },
}));

export default useUserProfileStore;
