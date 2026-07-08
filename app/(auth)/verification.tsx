import React, { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Ionicons } from '@expo/vector-icons';

// Validation schema for manual OTP entry
const verificationSchema = z.object({
  code: z.string().min(6, 'Verification code must be exactly 6 digits'),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

export default function Verification() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(59);

  // Read email or token from URL dynamic deep linking params if passed from email click
  const { token, email } = params;

  const { control, handleSubmit, formState: { errors } } = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { code: '' }
  });

  // Countdown clock handling logic for the resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Automated Hook: Trigger verification instantly if deep link parameters are present
  useEffect(() => {
    if (token) {
      handleTokenVerification(token as string);
    }
  }, [token]);

  // Handler for deep-linked token clicks
  const handleTokenVerification = async (authToken: string) => {
    setIsVerifying(true);
    try {
      // Simulate verification payload exchange with network layer
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Account Verified',
        'Your email has been successfully verified! Please log in.',
        [{ text: 'Proceed to Sign In', onPress: () => router.replace('/(auth)/signin') }]
      );
    } catch (error) {
      Alert.alert('Verification Failed', 'The activation link is invalid or has expired.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handler for manual 6-digit form code submissions
  const onSubmit = async (data: VerificationFormValues) => {
    setIsVerifying(true);
    try {
      // Simulate validation request to Node.js backend controller
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'Success',
        'Email address verified successfully.',
        [{ text: 'Continue to Login', onPress: () => router.replace('/(auth)/signin') }]
      );
    } catch (error) {
      Alert.alert('Invalid Code', 'The verification code you entered is incorrect.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      // Trigger API call for new registration token payload distribution
      Alert.alert('Code Resent', 'A new 6-digit code has been delivered to your email inbox.');
      setResendCountdown(59);
    } catch (error) {
      Alert.alert('Error', 'Unable to process resend request. Try again later.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Top Branding Layout */}
        <View style={styles.brandHeader}>
          <Ionicons name="business" size={28} color="#007AFF" />
          <Text style={styles.brandText}>AccessibilityPro</Text>
        </View>

        {isVerifying ? (
          /* Loading Context Processing Wrapper */
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Securing Account Authentications...</Text>
          </View>
        ) : (
          /* Main Processing Context UI */
          <View>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We sent a verification confirmation to your email {email ? `(${email})` : ''}. 
              Enter the 6-digit authorization code below or click the direct verification link in your email.
            </Text>

            {/* Verification OTP Code Input Field wrapper */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>6-Digit Security Code</Text>
              <Controller
                control={control}
                name="code"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.code && styles.inputError]}
                    placeholder="123456"
                    placeholderTextColor="#A2A2A7"
                    keyboardType="number-pad"
                    maxLength={6}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    letterSpacing={4} // Makes digit groups scannable
                  />
                )}
              />
              {errors.code && <Text style={styles.errorText}>{errors.code.message}</Text>}
            </View>

            <TouchableOpacity 
              style={styles.verifyButton} 
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.verifyButtonText}>Confirm Verification</Text>
            </TouchableOpacity>

            {/* Resend Verification Metrics Controls */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the email? </Text>
              {resendCountdown > 0 ? (
                <Text style={styles.timerText}>Resend in {resendCountdown}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResendCode}>
                  <Text style={styles.resendLink}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>
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
    marginBottom: 32,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666667',
    marginBottom: 36,
    lineHeight: 22,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
    marginBottom: 10,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
    color: '#1C1C1E',
    backgroundColor: '#FAFAFC',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFFBFA',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  verifyButton: {
    height: 52,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  timerText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  resendLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#666667',
    fontWeight: '500',
  },
});