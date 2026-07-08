import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Define user roles explicitly to support both consumer interfaces and merchant/owner consoles
export type UserRole = 'customer' | 'owner' | null;

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedFields: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ASYNC_STORAGE_AUTH_KEY = '@AccessibilityPro:Auth_Session';

/**
 * Global Authentication Protected Layout Navigation Guardian Hook
 */
function useProtectedRoute(user: UserProfile | null, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if the current route segment resides inside the protected tab tree
    const inAuthGroup = segments[0] === '(drawer)' || segments[0] === 'drawer';

    if (!user && inAuthGroup) {
      // Intercept unauthenticated traffic trying to reach deep dashboard segments
      router.replace('/auth/signin');
    } else if (user && !inAuthGroup) {
      // Diverge routing engines seamlessly matching target corporate roles
      if (user.role === 'owner') {
        router.replace('/(drawer)/owner-dashboard');
      } else {
        router.replace('/(drawer)/explore');
      }
    }
  }, [user, isLoading, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize protected observer rules over children route elements
  useProtectedRoute(user, isLoading);

  // Hydrate session configurations locally out of storage on app initialization
  useEffect(() => {
    async function hydrateAuthSession() {
      try {
        const serializedSession = await AsyncStorage.getItem(ASYNC_STORAGE_AUTH_KEY);
        if (serializedSession) {
          const profile: UserProfile = JSON.parse(serializedSession);
          setUser(profile);
        }
      } catch (error) {
        console.error('Failed to parse local auth cache payload indices:', error);
      } finally {
        setIsLoading(false);
      }
    }
    hydrateAuthSession();
  }, []);

  const login = async (profile: UserProfile) => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem(ASYNC_STORAGE_AUTH_KEY, JSON.stringify(profile));
      setUser(profile);
    } catch (error) {
      console.error('Session configuration write operation exception:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem(ASYNC_STORAGE_AUTH_KEY);
      setUser(null);
    } catch (error) {
      console.error('Session eviction routine clearance fault:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedFields: Partial<UserProfile>) => {
    try {
      if (!user) return;
      const mergedProfile = { ...user, ...updatedFields };
      await AsyncStorage.setItem(ASYNC_STORAGE_AUTH_KEY, JSON.stringify(mergedProfile));
      setUser(mergedProfile);
    } catch (error) {
      console.error('Profile payload runtime alteration drop error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Access hook for hot reloading shared runtime auth variables globally
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be called exclusively within children wrapped under an AuthProvider framework element tree.');
  }
  return context;
}