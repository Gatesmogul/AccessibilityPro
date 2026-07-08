import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// Define strict Zod validation schema matching your specifications
const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  // FIXED: Allows the field to be optional or an empty string safely
  phoneNumber: z.string().optional().or(z.literal('')),
  address: z.string().min(5, 'Address must be complete'),
  occupation: z.string().min(2, 'Occupation is required'),
  role: z.enum(['owner', 'customer'], {
    errorMap: () => ({ message: 'Please select your account type' }),
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
      occupation: '',
      role: undefined,
    }
  });

  const selectedRole = watch('role');

  // Image Picker Logic
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'AccessibilityPro needs gallery access to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Form Submission Strategy
  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      // Package your text data alongside the profileImage path
      const completePayload = { ...data, profileImage };
      console.log('Sending payload to backend:', completePayload);

      // Simulate Backend API communication
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        'Verification Sent!',
        `A verification email has been sent to ${data.email}. Please verify your identity to continue.`,
        [{ text: 'OK', onPress: () => router.replace('/(auth)/verification') }]
      );
    } catch (error) {
      Alert.alert('Registration Failed', 'An error occurred during signup. Please try again.');
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
        
        {/* Top Header Layer featuring App Brand Logo */}
        <View style={styles.brandHeader}>
          <Ionicons name="business" size={32} color="#007AFF" />
          <Text style={styles.brandText}>AccessibilityPro</Text>
        </View>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Register to start hosting or renting high-spec properties.</Text>

        {/* Profile Picture Uploader */}
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity style={styles.imageHolder} onPress={pickImage} activeOpacity={0.8}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={32} color="#8E8E93" />
                <Text style={styles.imagePlaceholderText}>Upload Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Full Name Input Field */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Full Name</Text>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="John Doe"
                placeholderTextColor="#A2A2A7"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
        </View>

        {/* Email Input Field */}
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

        {/* Password Input Field */}
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

        {/* Phone Number Input Field */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Phone Number (Optional)</Text>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.phoneNumber && styles.inputError]}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#A2A2A7"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
        </View>

        {/* Address Input Field */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Physical Address</Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.address && styles.inputError]}
                placeholder="123 Luxury Estate Drive, City"
                placeholderTextColor="#A2A2A7"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
        </View>

        {/* Occupation Input Field */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Occupation</Text>
          <Controller
            control={control}
            name="occupation"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.occupation && styles.inputError]}
                placeholder="Software Engineer / Consultant"
                placeholderTextColor="#A2A2A7"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.occupation && <Text style={styles.errorText}>{errors.occupation.message}</Text>}
        </View>

        {/* Account Status Selection (Role Configuration) */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Account Status</Text>
          
          {/* Owner Selection Box */}
          <TouchableOpacity 
            style={[styles.checkboxContainer, selectedRole === 'owner' && styles.checkboxContainerActive]}
            onPress={() => setValue('role', 'owner', { shouldValidate: true })}
            activeOpacity={0.7}
          >
            <Text style={styles.checkboxLabel}>Owner / Real Estate Business</Text>
            <View style={[styles.checkbox, selectedRole === 'owner' && styles.checkboxChecked]}>
              {selectedRole === 'owner' && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>

          {/* Customer Selection Box */}
          <TouchableOpacity 
            style={[styles.checkboxContainer, selectedRole === 'customer' && styles.checkboxContainerActive]}
            onPress={() => setValue('role', 'customer', { shouldValidate: true })}
            activeOpacity={0.7}
          >
            <Text style={styles.checkboxLabel}>Customer</Text>
            <View style={[styles.checkbox, selectedRole === 'customer' && styles.checkboxChecked]}>
              {selectedRole === 'customer' && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>
          
          {errors.role && <Text style={styles.errorText}>{errors.role.message}</Text>}
        </View>

        {/* Main Pressable Registration Button */}
        <TouchableOpacity 
          style={styles.signupButton} 
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signupButtonText}>Sign Up</Text>
          )}
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
    paddingTop: 40,
    paddingBottom: 60,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 30,
    lineHeight: 20,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageHolder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '500',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // FIXED: 'between' was changed to 'space-between'
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FAFAFC',
  },
  checkboxContainerActive: {
    borderColor: '#007AFF',
    backgroundColor: '#F2F8FF',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  signupButton: {
    height: 52,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});