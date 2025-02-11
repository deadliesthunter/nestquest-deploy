import { Redirect, Stack } from "expo-router";
import { AuthProvider, AuthContext } from "@/store/authStore"; // Adjust the import path as needed
import { useContext } from "react";

export default function Authlayout() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

function AuthWrapper() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Enable headers if needed
        headerTitle: "",
      }}
    >
      <Stack.Screen
        name="forgetpas"
        options={{
          headerShown: true,
          headerTitle: "Reset",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: "#f9f9f9",
          },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
