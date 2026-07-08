import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Ionicons } from '@expo/vector-icons';

// Define explicit Zod validation schemas for the two steps
const requestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  resetToken: z.string().min(4, 'Enter the complete verification token'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
});

type RequestFormValues = z.infer<typeof requestSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook Form for Step 1: Request Reset Link
  const requestForm = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: '' }
  });

  // Hook Form for Step 2: Input Token and New Password
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '', resetToken: '', newPassword: '' }
  });

  // Action 1: Dispatch Reset Email Token Request
  const onRequestSubmit = async (data: RequestFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate Backend Endpoint Connection
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'Token Dispatched',
        `A secure verification token has been sent to ${data.email}.`,
        [{ 
          text: 'Proceed', 
          onPress: () => {
            resetForm.setValue('email', data.email); // Auto-fill email in step 2
            setStep('reset');
          } 
        }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to request password reset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Action 2: Commit New Password Update
  const onResetSubmit = async (data: ResetFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate Password Reset Backend Execution
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'Success',
        'Your password has been reset successfully. Please sign in with your new credentials.',
        [{ text: 'Sign In', onPress: () => router.replace('/(auth)/signin') }]
      );
    } catch (error) {
      Alert.alert('Reset Failed', 'Invalid token or configuration error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Brand Top Header Indicator */}
        <View style={styles.brandHeader}>
          <Ionicons name="business" size={28} color="#007AFF" />
          <Text style={styles.brandText}>AccessibilityPro</Text>
        </View>

        {step === 'request' ? (
          /* ==================== STEP 1 UI ==================== */
          <View>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your registered email address to receive a verification token.</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <Controller
                control={requestForm.control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, requestForm.formState.errors.email && styles.inputError]}
                    placeholder="example@domain.com"
                    placeholderTextColor="#A2A2A7"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {requestForm.formState.errors.email && (
                <Text style={styles.errorText}>{requestForm.formState.errors.email.message}</Text>
              )}
            </View>

            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={requestForm.handleSubmit(onRequestSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Send Token</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          /* ==================== STEP 2 UI ==================== */
          <View>
            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.subtitle}>Enter the token sent to your email along with your new account password.</Text>

            {/* Hidden/Locked Email Display Context */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Confirm Email Address</Text>
              <Controller
                control={resetForm.control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    editable={false}
                    value={value}
                  />
                )}
              />
            </View>

            {/* Token Verification Field Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Verification Token</Text>
              <Controller
                control={resetForm.control}
                name="resetToken"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, resetForm.formState.errors.resetToken && styles.inputError]}
                    placeholder="Enter Token"
                    placeholderTextColor="#A2A2A7"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {resetForm.formState.errors.resetToken && (
                <Text style={styles.errorText}>{resetForm.formState.errors.resetToken.message}</Text>
              )}
            </View>

            {/* New Password Input Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>New Password</Text>
              <Controller
                control={resetForm.control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, resetForm.formState.errors.newPassword && styles.inputError]}
                    placeholder="••••••••"
                    placeholderTextColor="#A2A2A7"
                    secureTextEntry
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {resetForm.formState.errors.newPassword && (
                <Text style={styles.errorText}>{resetForm.formState.errors.newPassword.message}</Text>
              )}
            </View>

            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={resetForm.handleSubmit(onResetSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Update Password</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => setStep('request')}>
              <Text style={styles.backButtonText}>Request a new token</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    marginLeft: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666667',
    marginBottom: 32,
    lineHeight: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1C1C1E',
    backgroundColor: '#FAFAFC',
  },
  disabledInput: {
    backgroundColor: '#E5E5EA',
    borderColor: '#D1D1D6',
    color: '#8E8E93',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFFBFA',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  primaryButton: {
    height: 52,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
});