import { Platform } from 'react-native';

/**
 * ============================================================================
 * 1. Global Application Core Color Palette Tokens
 * ============================================================================
 */
export const Colors = {
  light: {
    // Brand Core
    primary: '#007AFF',
    primaryLight: '#F4F9FF',
    primaryDark: '#0056B3',
    accent: '#5856D6',
    
    // System Semantic States
    success: '#34C759',
    successBackground: '#E8F9EE',
    warning: '#FF9500',
    warningBackground: '#FFF5E6',
    error: '#FF3B30',
    errorBackground: '#FFEBEA',
    info: '#5AC8FA',

    // Neutral Grayscale Foundations
    background: '#F2F2F7',
    surface: '#FFFFFF',
    border: '#C6C6C8',
    borderLight: '#E5E5EA',

    // Typography Layer Hierarchy
    textPrimary: '#1C1C1E',
    textSecondary: '#636366',
    textPlaceholder: '#8E8E93',
    textMuted: '#AEAEB2',
    textOnPrimary: '#FFFFFF',
  },
  dark: {
    // Brand Core
    primary: '#0A84FF',
    primaryLight: '#152E4D',
    primaryDark: '#0066CC',
    accent: '#5E5CE6',
    
    // System Semantic States
    success: '#30D158',
    successBackground: '#1C3524',
    warning: '#FF9F0A',
    warningBackground: '#352918',
    error: '#FF453A',
    errorBackground: '#371E1B',
    info: '#64D2FF',

    // Neutral Grayscale Foundations
    background: '#000000',
    surface: '#1C1C1E',
    border: '#38383A',
    borderLight: '#2C2C2E',

    // Typography Layer Hierarchy
    textPrimary: '#FFFFFF',
    textSecondary: '#E5E5EA',
    textPlaceholder: '#8E8E93',
    textMuted: '#48484A',
    textOnPrimary: '#FFFFFF',
  }
};

// Fallback constant defaults targeting core components directly if context drops
export const Palette = Colors.light;

/**
 * ============================================================================
 * 2. Shared Layout Architectural System Tokens
 * ============================================================================
 */
export const Layout = {
  // Common Structural Element Border Radii
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
    full: 9999,
  },
  
  // Padding & Margin Multipliers
  spacing: {
    xs: 4,
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 24,
    xxlarge: 32,
  },

  // Consistent Native Interface Elements Native Elevation
  shadow: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
    default: {}
  }),
};

/**
 * ============================================================================
 * 3. Network Architecture Endpoints Config Matrix
 * ============================================================================
 */
const BASE_URLS = {
  development: Platform.select({
    android: 'http://10.0.2.2:5001/api/v1', // Standard loopback intercept pointing to local backend environments safely
    ios: 'http://localhost:5001/api/v1',
    default: 'http://localhost:5001/api/v1',
  }),
  staging: 'https://staging.api.accessibilitypro.com/api/v1',
  production: 'https://api.accessibilitypro.com/api/v1',
};

// Toggle baseline context layer automatically or via explicit env compilation
const CURRENT_ENV: 'development' | 'staging' | 'production' = __DEV__ 
  ? 'development' 
  : 'production';

export const ApiConfig = {
  baseUrl: BASE_URLS[CURRENT_ENV],
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      profile: '/auth/me',
      refresh: '/auth/refresh-token',
    },
    properties: {
      list: '/properties',
      details: (id: string) => `/properties/${id}`,
      verifyTransaction: '/properties/verify-receipt',
    },
    cart: {
      sync: '/cart/sync',
      checkout: '/cart/checkout',
    }
  }
};