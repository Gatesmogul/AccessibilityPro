import api from './api';
import { UserProfile } from '../context/AuthContext';

// Explicit Data Interface Inputs matching backend request payload validations
export interface SignInCredentials {
  email: string;
  password?: string;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role: 'customer' | 'owner';
}

/**
 * Server Authentication Response Shape
 * Maps expected incoming network records including JWT access token signatures.
 */
export interface AuthResponseData {
  success: boolean;
  message: string;
  token?: string;
  user: UserProfile;
}

export const authService = {
  /**
   * Authenticate an active session against registry collections.
   * @param credentials - Structured email and verification passcode dictionary.
   */
  async signIn(credentials: SignInCredentials): Promise<AuthResponseData> {
    try {
      const response = await api.post<AuthResponseData>('/auth/signin', credentials);
      return response.data;
    } catch (error: any) {
      // Intercept and throw explicit backend message lines or fallback defaults
      throw new Error(
        error.response?.data?.message || 
        'An error occurred during authentication processing.'
      );
    }
  },

  /**
   * Provision a brand-new user or merchant registration record profile.
   * @param payload - Complete registry object including business roles parameters.
   */
  async signUp(payload: SignUpPayload): Promise<AuthResponseData> {
    try {
      const response = await api.post<AuthResponseData>('/auth/signup', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Account registration framework failed to write record entry.'
      );
    }
  },

  /**
   * Terminate device telemetry tracking links and evict operational access tokens.
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/logout');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Session termination command rejected by backend cluster.'
      );
    }
  }
};