import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ASYNC_STORAGE_AUTH_KEY = '@AccessibilityPro:Auth_Session';

/**
 * Configure target operational gateway base address endpoint arrays.
 * Adjust the fallback string IP definitions matching your production environment deployment metrics.
 */
const getBaseUrl = (): string => {
  if (__DEV__) {
    // When running locally, Android emulators sandbox localhost to 10.0.2.2 
    // while iOS simulators access machine localhost natively.
    return Platform.OS === 'android' 
      ? 'http://10.0.2.2:5000/api/v1' 
      : 'http://localhost:5000/api/v1';
  }
  return process.env.EXPO_PUBLIC_API_URL || 'https://accessibilitypro.onrender.com/api/v1';
};

const api: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request Interceptor Engine
 * Automatically extracts the cached user authorization token string signature 
 * out of AsyncStorage and binds it to outgoing HTTP Headers.
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const serializedSession = await AsyncStorage.getItem(ASYNC_STORAGE_AUTH_KEY);
      
      if (serializedSession) {
        const parsedSession = JSON.parse(serializedSession);
        // Assuming your auth payload stores a token field (e.g., JWT token signature)
        const token = parsedSession?.token || parsedSession?.uid;

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Failed to parse validation token telemetry within API layer:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor Engine
 * Catches incoming payloads and acts as a central hub to trap 401 Unauthorized exceptions 
 * or 403 Forbidden token expiration issues for session clear routines.
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the server rejected the connection because of token invalidity
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.warn('Session signature validated as expired. Clearing local token indices...');
        // Optional: Trigger global event or route to clean up dead sessions from storage
        // await AsyncStorage.removeItem(ASYNC_STORAGE_AUTH_KEY);
      } catch (clearError) {
        console.error('Failed to clear expired session memory pointers:', clearError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
