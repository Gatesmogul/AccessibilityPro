import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface UserSession {
  email: string;
  role: 'customer' | 'owner';
  fullName: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserSession | null;
  login: (userData: UserSession) => void;
  logout: () => void;
  saveCredentials: (email: string, pass: string, role: 'customer' | 'owner') => Promise<void>;
  clearCredentials: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
  
  saveCredentials: async (email, pass, role) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('auth_email', email);
        localStorage.setItem('auth_password', pass);
        localStorage.setItem('auth_role', role);
      } else {
        await SecureStore.setItemAsync('auth_email', email);
        await SecureStore.setItemAsync('auth_password', pass);
        await SecureStore.setItemAsync('auth_role', role);
      }
    } catch (e) {
      console.error('Failed to save secure credentials', e);
    }
  },
  
  clearCredentials: async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('auth_email');
        localStorage.removeItem('auth_password');
        localStorage.removeItem('auth_role');
      } else {
        await SecureStore.deleteItemAsync('auth_email');
        await SecureStore.deleteItemAsync('auth_password');
        await SecureStore.deleteItemAsync('auth_role');
      }
    } catch (e) {
      console.error('Failed to clear secure credentials', e);
    }
  },
}));