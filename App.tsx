import { ThemeProvider, createTheme } from '@rneui/themed';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

// Professional Dark Theme Configuration
const theme = createTheme({
  lightColors: {
    primary: '#6366F1', // Modern indigo
    secondary: '#10B981', // Modern emerald
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    black: '#FFFFFF',
    white: '#0F0F0F', // Deep dark background
    grey0: '#1C1C1E', // Card/Surface color
    grey1: '#2C2C2E', // Elevated surface
    grey2: '#3A3A3C', // Border colors
    grey3: '#8E8E93', // Secondary text
    grey4: '#C7C7CC', // Primary text muted
    grey5: '#F2F2F7', // Light backgrounds
  },
  darkColors: {
    primary: '#6366F1', // Modern indigo - consistent across themes
    secondary: '#10B981', // Modern emerald
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    black: '#FFFFFF', // Primary text color
    white: '#0F0F0F', // Main background
    grey0: '#1C1C1E', // Card/Surface - slightly lighter than background
    grey1: '#2C2C2E', // Elevated surface - for modals, overlays
    grey2: '#3A3A3C', // Borders, dividers
    grey3: '#8E8E93', // Secondary text, icons
    grey4: '#C7C7CC', // Muted text
    grey5: '#F2F2F7', // Light elements (rarely used in dark)
  },
  mode: 'dark'
});

export default function App() {
  // useEffect(() => {
  //   // Firebase bağlantısını test et (sadece development'ta)
  //   if (__DEV__) {
  //     testFirebaseConnection()
  //       .then((success) => {
  //         if (success) {
  //           console.log('🔥 Firebase başarıyla bağlandı!');
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Firebase bağlantı hatası:', error);
  //       });
  //   }
  // }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
      <ThemeProvider theme={theme}>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}