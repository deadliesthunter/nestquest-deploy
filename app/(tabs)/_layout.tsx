import React, { useContext } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { Tabs, Redirect, Stack } from 'expo-router';
import TabBar from '@/components/buttomnav/TabBar';
import "@/global.css";
import { ThemeProvider, ThemeContext } from '@/components/theme/ThemContext'; // Ensure correct import path
import { AuthProvider, AuthContext } from '@/store/authStore'; // Ensure correct import path

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

function RootContent() {
  const { isAuthenticated } = useContext(AuthContext); // Use the context properly
  const { colors } = useContext(ThemeContext); // Use the context properly

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
      <StatusBar
        barStyle={colors.background === '#121212' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          
          headerStyle: { backgroundColor: colors.background, },
          headerTintColor: colors.text, // Set color for header text and icons
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false, // Hide header for the home screen
          }}
        />
        <Tabs.Screen
          name="maps"
          options={{
            title: "Maps",
          }}
        />
        <Tabs.Screen
          name="bookmark"
          options={{
            title: "Bookmark",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
      </Tabs>
    </>
  );
}
