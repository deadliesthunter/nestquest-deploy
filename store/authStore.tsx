import React, { createContext, useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // For showing a loading state

  // API Base URL (use environment variables for production)
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  // Login action
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data to state
        setUser(data.user);
        setToken(data.token);
        setIsAuthenticated(true);

        // Save token to AsyncStorage
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userid", data.user.id);
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout action
  const logout = async () => {
    try {
      // Clear state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      // Remove token from AsyncStorage
      await AsyncStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check authentication status on app startup
  const initializeAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);

        // Optional: Fetch user details with the token
        const response = await fetch(`${API_BASE_URL}/user/`, {
          headers: {
            Authorization: `Token ${storedToken}`, // Ensure "Token" prefix
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.warn("Token expired or invalid");
          await logout();
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      setLoading(false); // Ensure loading state is cleared
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      login,
      logout,
      loading,
    }),
    [user, token, isAuthenticated, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

// A simple loading screen component
const LoadingScreen = () => (
  <React.Fragment>
    <Text>Loading...</Text>
  </React.Fragment>
);

export { AuthContext, AuthProvider };
