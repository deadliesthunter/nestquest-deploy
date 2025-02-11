// app/_layout.tsx
import { Redirect, Stack } from "expo-router";
import "../global.css";
import { ThemeProvider } from '@/components/theme/ThemContext'; // Fix typo in "ThemeContext"
import { useContext } from "react";
import { ThemeContext } from '@/components/theme/ThemContext'; // Fix typo in "ThemeContext"

// Wrap the RootLayout with ThemeProvider
export default function RootLayout() {
 
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