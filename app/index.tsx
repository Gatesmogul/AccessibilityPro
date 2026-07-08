import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch the authentication status
SplashScreen.preventAutoHideAsync().catch((err) => {
  console.warn("Splash screen preventAutoHideAsync error:", err);
});

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // PLACEHOLDER AUTH STATE: In production, replace this with your actual AuthContext/Zustand store
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'customer' | 'owner' | null>(null);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        // Simulate an asynchronous API or AsyncStorage check for user token/role
        // e.g., const token = await AsyncStorage.getItem('userToken');
        await new Promise((resolve) => setTimeout(resolve, 1500)); 

        // Mock values for demonstration: change these to test different routing targets
        setIsAuthenticated(false); 
        setUserRole(null);

      } catch (error) {
        console.error("Failed to check authentication status:", error);
        // Fallback to auth screen if something goes wrong
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Wait until the authentication check is fully complete
    if (isLoading) return;

    // Hide the splash screen now that we know where to route the user
    SplashScreen.hideAsync().catch((err) => {
      console.warn("Splash screen hideAsync error:", err);
    });

    if (isAuthenticated) {
      // Redirect based on user type
      if (userRole === 'owner') {
        router.replace('/(drawer)/owner-dashboard');
      } else {
        router.replace('/(drawer)/homepage');
      }
    } else {
      // User is not authenticated, send them to the sign-in flow
      router.replace('/(auth)/signin');
    }
  }, [isLoading, isAuthenticated, userRole, router]);

  // Fallback UI to show a loader if Splash Screen layout unmounts early
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});