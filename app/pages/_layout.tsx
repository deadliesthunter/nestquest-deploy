import { Redirect, router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Text } from 'react-native'
import { useContext } from 'react';
import { ThemeContext } from '@/components/theme/ThemContext';
import { AuthProvider, AuthContext } from '@/store/authStore'; // Ensure correct import path


export default function RootLayout() {
  return (
    <AuthProvider>
      
        <Layout />
     
    </AuthProvider>
  );
}


 function Layout() {
  const { colors } = useContext(ThemeContext);
    const { isAuthenticated } = useContext(AuthContext); // Use the context pro
    
    if (!isAuthenticated) {
      return <Redirect href="/(auth)/login" />;
    }
  
  return (
    <Stack
    screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.text, // Color of header text and icons
    }}
    >
      <Stack.Screen
        name="chatbox"
        options={{
          headerTitle: "chatbox", // Set the title
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Text className="text-blue-600 text-2xl">←</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: "center", // Align the title to the center

          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="notificationLayout"
        options={{
          headerTitle: "notification", // Set the title
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Text className="text-blue-600 text-2xl">←</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: "center", // Align the title to the center

          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
          },
        }}
      />

      
        
      
      <Stack.Screen
        name="roomprofile"
        options={{
          headerTitle: "Room Profile", // Set the title
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Text className="text-blue-600 text-2xl">←</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: "center", // Align the title to the center

          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="setting"
        options={{
          headerTitle: "setting", // Set the title
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Text className="text-blue-600 text-2xl">←</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: "center", // Align the title to the center

          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="makePost"
        options={{
          headerTitle: "", // Set the title
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Text className="text-blue-600 text-2xl">←</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: "center", // Align the title to the center

          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
          },
        }}
      />

    </Stack>
  );
}
