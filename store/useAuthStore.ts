import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  EMAIL: 'auth_email',
  PASSWORD: 'auth_password',
  ROLE: 'auth_role',
};

export interface UserSession {
  uid?: string;
  fullName: string;
  email: string;
  role: 'customer' | 'owner';
  token?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserSession | null;

  login: (user: UserSession) => void;

  logout: () => Promise<void>;

  saveCredentials: (
    email: string,
    password: string,
    role: 'customer' | 'owner'
  ) => Promise<void>;

  clearCredentials: () => Promise<void>;

  saveToken: (token: string) => Promise<void>;

  getToken: () => Promise<string | null>;

  clearToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  user: null,

  login: (user) =>
    set({
      isAuthenticated: true,
      user,
    }),

  logout: async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);

    if (Platform.OS === 'web') {
      localStorage.removeItem(STORAGE_KEYS.EMAIL);
      localStorage.removeItem(STORAGE_KEYS.PASSWORD);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } else {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.EMAIL);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.PASSWORD);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ROLE);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
    }

    set({
      isAuthenticated: false,
      user: null,
    });
  },

  saveCredentials: async (email, password, role) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(STORAGE_KEYS.EMAIL, email);
        localStorage.setItem(STORAGE_KEYS.PASSWORD, password);
        localStorage.setItem(STORAGE_KEYS.ROLE, role);
      } else {
        await SecureStore.setItemAsync(STORAGE_KEYS.EMAIL, email);
        await SecureStore.setItemAsync(STORAGE_KEYS.PASSWORD, password);
        await SecureStore.setItemAsync(STORAGE_KEYS.ROLE, role);
      }
    } catch (error) {
      console.error('Failed to save credentials:', error);
    }
  },

  clearCredentials: async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(STORAGE_KEYS.EMAIL);
        localStorage.removeItem(STORAGE_KEYS.PASSWORD);
        localStorage.removeItem(STORAGE_KEYS.ROLE);
      } else {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.EMAIL);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.PASSWORD);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.ROLE);
      }
    } catch (error) {
      console.error('Failed to clear credentials:', error);
    }
  },

  saveToken: async (token: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      } else {
        await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
      }
    } catch (error) {
      console.error('Failed to save auth token:', error);
    }
  },

  getToken: async () => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
      }

      return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Failed to retrieve auth token:', error);
      return null;
    }
  },

  clearToken: async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      } else {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
      }
    } catch (error) {
      console.error('Failed to clear auth token:', error);
    }
  },
}));
