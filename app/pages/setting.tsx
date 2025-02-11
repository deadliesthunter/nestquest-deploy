// app/(tabs)/profile.tsx

import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@/components/theme/ThemContext';

import { useContext } from "react";
import { AuthContext } from "@/store/authStore";

const ProfileScreen = () => {
  const { colors, toggleTheme } = useContext(ThemeContext);

    const { logout } = useContext(AuthContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text }}>Profile Screen</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
          {/* Logout Button */}
          <TouchableOpacity
        className="bg-red-500 px-4 py-3 rounded-lg items-center"
        onPress={logout}
      >
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;