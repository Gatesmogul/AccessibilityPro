import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Pressable, 
  StyleProp, 
  ViewStyle, 
  TextInputProps 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  /** Label text displayed prominently directly above the entry lane */
  label?: string;
  /** Floating structural warning string that changes borders to alert states when validated */
  error?: string;
  /** Leading vector icon identifier matching theme rules */
  iconLeft?: IconName;
  /** Custom wrapper element styling overrides */
  containerStyle?: StyleProp<ViewStyle>;
}

export default function InputField({
  label,
  error,
  iconLeft,
  secureTextEntry,
  containerStyle,
  onFocus,
  onBlur,
  ...restProps
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Structural dynamic status hooks
  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Evaluate final state of mask toggle criteria
  const shouldMaskText = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.mainWrapper, containerStyle]}>
      {label && <Text style={[styles.fieldLabel, error ? styles.textErrorLabel : null]}>{label}</Text>}
      
      <View style={[
        styles.inputTrackRow,
        isFocused && styles.inputFocused,
        error ? styles.inputErrorBorder : null
      ]}>
        
        {iconLeft && (
          <Ionicons 
            name={iconLeft} 
            size={18} 
            color={error ? '#FF3B30' : isFocused ? '#007AFF' : '#8E8E93'} 
            style={styles.leftIcon} 
          />
        )}

        <TextInput
          style={styles.nativeInputControl}
          placeholderTextColor="#8E8E93"
          secureTextEntry={shouldMaskText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={secureTextEntry ? 'none' : restProps.autoCapitalize}
          autoCorrect={secureTextEntry ? false : restProps.autoCorrect}
          {...restProps}
        />

        {/* Dynamic toggle visibility overlay trigger logic for secure text fields */}
        {secureTextEntry && (
          <Pressable 
            style={styles.rightActionBtn} 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            accessibilityRole="checkbox"
            accessibilityLabel="Toggle password tracking layout masking view option"
          >
            <Ionicons 
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
              size={18} 
              color="#636366" 
            />
          </Pressable>
        )}
      </View>

      {error && (
        <View style={styles.errorAlertLayout}>
          <Ionicons name="alert-circle" size={14} color="#FF3B30" />
          <Text style={styles.errorTextString}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    width: '100%',
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3A3C',
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  textErrorLabel: {
    color: '#FF3B30',
  },
  inputTrackRow: {
    width: '100%',
    height: 46,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: '#007AFF',
  },
  inputErrorBorder: {
    backgroundColor: '#FDF2F2',
    borderColor: '#FF3B30',
  },
  leftIcon: {
    marginRight: 10,
  },
  nativeInputControl: {
    flex: 1,
    height: '100%',
    color: '#1C1C1E',
    fontSize: 14,
    fontWeight: '500',
    padding: 0, 
  },
  rightActionBtn: {
    paddingLeft: 10,
    height: '100%',
    justifyContent: 'center',
  },
  errorAlertLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorTextString: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '500',
  },
});