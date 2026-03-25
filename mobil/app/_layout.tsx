import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { getAccessToken } from '@/api/api'; 

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/auth/AuthProvider';
import { BackendProvider } from '@/auth/BackendProvider';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  //console.log("RootLayout render, accessToken:", getAccessToken()); // Debug: ellenőrizzük az accessToken értékét
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* A teljes app a backend- es auth-provideren keresztul kap kozos allapotot. */}
      <BackendProvider>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
        </AuthProvider>
      </BackendProvider>
      
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
