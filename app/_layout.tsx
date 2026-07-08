import React, { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Import your AuthProvider cleanly from its context path
import { AuthProvider } from '../context/AuthContext'; 

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync().catch((err) => {
  console.warn("Splash screen preventAutoHideAsync error in root layout:", err);
});

// Initialize the React Query client for data fetching/caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  // Correctly evaluate font hooks. If no custom fonts are added, 
  // useFonts instantly sets fontsLoaded to true on the next frame.
  const [fontsLoaded, fontError] = useFonts({
    // Add custom fonts here if needed, e.g.:
    // 'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Safely clear the native or web splash container once structural conditions are validated
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch((err) => {
        console.warn("Error dismissing splash screen:", err);
      });
    }
  }, [fontsLoaded, fontError]);

  // Catch early loading states. If fonts haven't completed their layout resolution 
  // and no font errors have fired, halt screen rendering cleanly.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {/* Required parent view context layer for Gesture/Drawer handlers across Web and Mobile targets */}
        <GestureHandlerRootView style={styles.container}>
          <SafeAreaProvider>
            {/* Dynamic global status bar matching your application theme */}
            <StatusBar style="dark" />
            
            {/* Main native presentation stack navigator layout */}
            <Stack screenOptions={{ headerShown: false }}>
              
              {/* The index route acts as the initial authentication router split */}
              <Stack.Screen name="index" />
              
              {/* Grouped authentication flows */}
              <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
              
              {/* Main Tab bar / Drawer architecture */}
              <Stack.Screen name="(drawer)" options={{ animation: 'fade' }} />
              
            </Stack>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});