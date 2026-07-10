import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { Platform } from 'react-native';
import { auth } from '../config/firebase';

const getBaseUrl = (): string => {
  if (__DEV__) {
    return Platform.OS === 'android'
      ? 'http://10.0.2.2:5001/api/v1'
      : 'http://localhost:5001/api/v1';
  }

  return (
    process.env.EXPO_PUBLIC_API_URL ??
    'https://accessibilitypro.onrender.com/api/v1'
  );
};

const api: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * Automatically attach Firebase ID Token
 */
api.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Refresh token if needed
        const token = await currentUser.getIdToken();

        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error('Failed to attach Firebase token:', error);

      return config;
    }
  },
  (error) => Promise.reject(error)
);

/**
 * Handle Unauthorized Responses
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request.');

      try {
        if (auth.currentUser) {
          await auth.currentUser.getIdToken(true);
        }
      } catch (refreshError) {
        console.error(
          'Unable to refresh Firebase token.',
          refreshError
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;
