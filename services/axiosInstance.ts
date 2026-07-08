import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_SESSION_KEY = '@AccessibilityPro:Auth_Session';

/**
 * Dynamically resolves the target network gateway based on current environment variables.
 * Accommodates standard routing sandboxes for Android Emulators and iOS Simulators during development loops.
 */
const resolveBaseUrl = (): string => {
  if (__DEV__) {
    return Platform.OS === 'android' 
      ? 'http://10.0.2.2:5000/api/v1' 
      : 'http://localhost:5000/api/v1';
  }
  return 'https://api.accessibilitypro.com/api/v1';
};

/**
 * Main Thread-Safe Axios Instance Core Initialization Block
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Global Outgoing Request Pipeline Interceptor
 * Injects verified Authorization Bearer string signatures directly into standard headers.
 */
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const cachedSessionData = await AsyncStorage.getItem(STORAGE_SESSION_KEY);
      
      if (cachedSessionData) {
        const parsedPayload = JSON.parse(cachedSessionData);
        // Extracts the unique access validation signature string
        const networkToken = parsedPayload?.token || parsedPayload?.uid;

        if (networkToken && config.headers) {
          config.headers.Authorization = `Bearer ${networkToken}`;
        }
      }
    } catch (error) {
      console.error('Interceptor runtime error extracting local session credentials:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Incoming Server Response Pipeline Interceptor
 * Traps runtime networking exceptions to catch credential invalidation flags automatically.
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const trackingConfigRequest = error.config;

    // Detect if authentication keys have expired or been rejected by the cluster
    if (error.response?.status === 401 && !trackingConfigRequest._retry) {
      trackingConfigRequest._retry = true;
      try {
        console.warn('Network layer caught a 401 Unauthorized status. Evicting expired token records...');
        // Clear routines can be linked here to force application state synchronization if needed
      } catch (evictionError) {
        console.error('Failed to safely purge expired runtime token references:', evictionError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;