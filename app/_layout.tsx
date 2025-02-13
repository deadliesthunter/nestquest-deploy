// app/_layout.tsx
import { Redirect, Stack } from "expo-router";
import "../global.css";
import { ThemeProvider } from '@/components/theme/ThemContext'; // Fix typo in "ThemeContext"
import { useContext, useEffect } from "react";
import { ThemeContext } from '@/components/theme/ThemContext'; // Fix typo in "ThemeContext"
import useAuthStore from "@/store/authStore"; // Fix typo in "authStore"


// Wrap the RootLayout with ThemeProvider
export default function RootLayout() {
  const { loading, initializeAuth } = useAuthStore();

  // Initialize authentication state on app startup
  useEffect(() => {
    initializeAuth();
  }, []);

 
  return (

    <ThemeProvider>
      <LayoutContent />
    </ThemeProvider>
  );
}


// Move the Stack and useContext logic to a separate component
function LayoutContent() {
  const { colors } = useContext(ThemeContext);

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Enable headers if needed
        headerTitle: "",   // Leave the title blank to avoid default folder names
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Add other screens here */}
    </Stack>
  );
}