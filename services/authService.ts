import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from 'firebase/auth';

import { auth } from '../config/firebase';
import api from './api';
import { UserProfile } from '../context/AuthContext';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  occupation: string;
  role: 'customer' | 'owner';
  profileImage?: string | null;
}

export interface AuthResponseData {
  success: boolean;
  message: string;
  token?: string;
  user: UserProfile;
}

export const authService = {
  /**
   * Register new user
   */
  async signUp(payload: SignUpPayload): Promise<AuthResponseData> {
    try {
      // Create Firebase account
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: payload.fullName,
      });

      // Send verification email
      await sendEmailVerification(userCredential.user);

      // Firebase ID Token
      const token = await userCredential.user.getIdToken();

      // Save profile to PostgreSQL
      const response = await api.post<AuthResponseData>(
        '/auth/register',
        {
          firebaseUid: userCredential.user.uid,
          fullName: payload.fullName,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
          address: payload.address,
          occupation: payload.occupation,
          role: payload.role,
          profileImage: payload.profileImage ?? null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        ...response.data,
        token,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to register account.'
      );
    }
  },

  /**
   * Login existing user
   */
  async signIn(
    credentials: SignInCredentials
  ): Promise<AuthResponseData> {
    try {
      // Firebase login
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        );

      if (!userCredential.user.emailVerified) {
        throw new Error(
          'Please verify your email before signing in.'
        );
      }

      // Firebase Token
      const token =
        await userCredential.user.getIdToken(true);

      // Get user profile from PostgreSQL
      const response = await api.get<AuthResponseData>(
        '/auth/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        ...response.data,
        token,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Invalid email or password.'
      );
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await signOut(auth);

      const response = await api.post<{
        success: boolean;
        message: string;
      }>('/auth/logout');

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Unable to logout.'
      );
    }
  },
};
