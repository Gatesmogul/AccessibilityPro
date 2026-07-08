import React, { useEffect, useState } from 'react';
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
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';

// Define explicit Sign In form boundaries
const signinSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password field cannot be empty'),
  role: z.enum(['customer', 'owner'], {
    errorMap: () => ({ message: 'You must select your account status' }),
  }),
  rememberMe: z.boolean().default(false),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export default function Signin() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, saveCredentials, clearCredentials } = useAuthStore();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
      role: undefined,
      rememberMe: false,
    }
  });

  const selectedRole = watch('role');
  const isRemembered = watch('rememberMe');

  // Load saved credentials securely on app startup if "Remember Me" was previously active
  useEffect(() => {
    async function loadSavedCredentials() {
      try {
        let savedEmail = null;
        let savedPassword = null;
        let savedRole = null;

        if (Platform.OS === 'web') {
          savedEmail = localStorage.getItem('auth_email');
          savedPassword = localStorage.getItem('auth_password');
          savedRole = localStorage.getItem('auth_role');
        } else {
          savedEmail = await SecureStore.getItemAsync('auth_email');
          savedPassword = await SecureStore.getItemAsync('auth_password');
          savedRole = await SecureStore.getItemAsync('auth_role');
        }

        if (savedEmail && savedPassword && (savedRole === 'customer' || savedRole === 'owner')) {
          setValue('email', savedEmail, { shouldValidate: true });
          setValue('password', savedPassword, { shouldValidate: true });
          setValue('role', savedRole, { shouldValidate: true });
          setValue('rememberMe', true);
        }
      } catch (e) {
        console.error('Failed to fetch secure values', e);
      }
    }
    loadSavedCredentials();
  }, [setValue]);

  // Submission routing execution
  const onSubmit = async (data: SigninFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate endpoint authentication exchange
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 1. Manage device memory credentials depending on user selection switch
      if (data.rememberMe) {
        if (Platform.OS === 'web') {
          localStorage.setItem('auth_email', data.email);
          localStorage.setItem('auth_password', data.password);
          localStorage.setItem('auth_role', data.role);
        } else {
          await saveCredentials(data.email, data.password, data.role);
        }
      } else {
        if (Platform.OS === 'web') {
          localStorage.removeItem('auth_email');
          localStorage.removeItem('auth_password');
          localStorage.removeItem('auth_role');
        } else {
          await clearCredentials();
        }
      }

      // 2. Commit authenticated session properties globally to the Zustand engine
      login({
        email: data.email,
        role: data.role,
        fullName: 'Logged In User',
      });

      // 3. Reroute application frame dynamically based on validated status parameters
      if (data.role === 'owner') {
        router.replace('/(drawer)/owner-dashboard');
      } else {
        router.replace('/(drawer)/homepage');
      }
    } catch (error) {
      if (Platform.OS === 'web') {
        alert('Authentication Error: Invalid credentials provided. Please check and try again.');
      } else {
        Alert.alert('Authentication Error', 'Invalid credentials provided. Please check and try again.');
      }
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
        
        {/* Top Header Section */}
        <View style={styles.brandHeader}>
          <Ionicons name="business" size={28} color="#007AFF" />
          <Text style={styles.brandText}>AccessibilityPro</Text>
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to manage listings or browse active properties.</Text>

        {/* Email Field Input Layout */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Email Address</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
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
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
        </View>

        {/* Password Field Input Layout */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
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
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
        </View>

        {/* Account Status Role Verification Toggle Buttons */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Account Status</Text>
          
          <TouchableOpacity 
            style={[styles.checkboxRow, selectedRole === 'customer' && styles.checkboxRowActive]}
            onPress={() => setValue('role', 'customer', { shouldValidate: true })}
          >
            <Text style={styles.checkboxLabel}>Customer</Text>
            <View style={[styles.tickBox, selectedRole === 'customer' && styles.tickBoxChecked]}>
              {selectedRole === 'customer' && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.checkboxRow, selectedRole === 'owner' && styles.checkboxRowActive]}
            onPress={() => setValue('role', 'owner', { shouldValidate: true })}
          >
            <Text style={styles.checkboxLabel}>Home Owner / Real Estate Business</Text>
            <View style={[styles.tickBox, selectedRole === 'owner' && styles.tickBoxChecked]}>
              {selectedRole === 'owner' && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>
          {errors.role && <Text style={styles.errorText}>{errors.role.message}</Text>}
        </View>

        {/* Remember Me Secure Module */}
        <TouchableOpacity 
          style={styles.rememberMeContainer}
          onPress={() => setValue('rememberMe', !isRemembered)}
        >
          <View style={[styles.tickBox, isRemembered && styles.tickBoxChecked]}>
            {isRemembered && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.rememberMeText}>Remember me</Text>
        </TouchableOpacity>

        {/* Actions Button Footers */}
        <TouchableOpacity 
          style={styles.signinButton} 
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signinButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.forgotButton}
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          <Text style={styles.forgotButtonText}>Forgot Password?</Text>
        </TouchableOpacity>

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
    paddingTop: 50,
    paddingBottom: 40,
  },
  brandHeader: {
    flexDirection: 'row', // Updated from flex: 'row'
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
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666667',
    marginBottom: 32,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FAFAFC',
  },
  checkboxRowActive: {
    borderColor: '#007AFF',
    backgroundColor: '#F2F8FF',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '500',
    flex: 1,
  },
  tickBox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickBoxChecked: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#3A3A3C',
    fontWeight: '500',
    marginLeft: 10,
  },
  signinButton: {
    height: 52,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotButton: {
    marginTop: 18,
    alignItems: 'center',
  },
  forgotButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});