// app/ThemeContext.js
import React, { createContext, useState } from 'react';
import { Colors } from './colors';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = {
    colors: isDarkMode ? DarkColors : LightColors,
    toggleTheme: () => setIsDarkMode((prev) => !prev),
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Define light and dark color schemes
const LightColors = {
  ...Colors,
  background: '#ffffff',
  text: '#000000',
};

const DarkColors = {
  ...Colors,
  background: '#121212',
  text: '#ffffff',
};