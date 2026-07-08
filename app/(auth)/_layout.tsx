import React from 'react';
import { Stack } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerShadowVisible: false, // Removes the bottom border line on headers
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: '#1A1A1A',
        },
        headerTintColor: '#007AFF', // Global tint for back arrow button icons
        animation: 'slide_from_right',
      }}
    >
      {/* Sign In Screen (Primary Entry Point) */}
      <Stack.Screen 
        name="signin" 
        options={{ 
          headerShown: false // Hidden by default for modern clean brand screens
        }} 
      />

      {/* Sign Up Screen */}
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: 'Create Account',
        }} 
      />

      {/* Verification OTP Screen */}
      <Stack.Screen 
        name="verification" 
        options={{ 
          title: 'Verify Identity',
          headerBackVisible: true,
        }} 
      />

      {/* Forgot Password Screen */}
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: 'Reset Password',
        }} 
      />
    </Stack>
  );
}