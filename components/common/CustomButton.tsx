import React from 'react';
import { 
  StyleSheet, 
  Text, 
  Pressable, 
  ActivityIndicator, 
  View, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Restrict to known valid icon name strings supported by the design system
type IconName = keyof typeof Ionicons.glyphMap;

interface CustomButtonProps {
  /** The core textual call to action displayed to the user */
  title: string;
  /** Trigger callback execution block handled when pressed */
  onPress: () => void;
  /** Visual theme mapping variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  /** Intercepts gestures and dims interface output when loading data arrays */
  isLoading?: boolean;
  /** Disables click actions and drops visibility contrast scales */
  disabled?: boolean;
  /** Leading vector icon displayed prior to structural string lines */
  iconLeft?: IconName;
  /** Trailing vector icon displayed following the text line */
  iconRight?: IconName;
  /** Optional custom layout styling overrides */
  style?: StyleProp<ViewStyle>;
  /** Optional custom text styling overrides */
  textStyle?: StyleProp<TextStyle>;
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  iconLeft,
  iconRight,
  style,
  textStyle
}: CustomButtonProps) {
  
  // Resolve runtime styles matching structural variants
  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return styles.btnSecondary;
      case 'outline':
        return styles.btnOutline;
      case 'text':
        return styles.btnText;
      case 'danger':
        return styles.btnDanger;
      case 'primary':
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.textOutline;
      case 'text':
        return styles.textVariantOnly;
      case 'primary':
      case 'secondary':
      case 'danger':
      default:
        return styles.textBaseColor;
    }
  };

  const getIconColor = () => {
    if (disabled) return '#AEAEB2';
    if (variant === 'outline' || variant === 'text') return '#007AFF';
    return '#FFFFFF';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled, busy: isLoading }}
      style={({ pressed }) => [
        styles.baseButton,
        getButtonStyles(),
        disabled && styles.btnDisabled,
        pressed && !disabled && styles.btnPressed,
        style
      ]}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'text' ? '#007AFF' : '#FFFFFF'} 
        />
      ) : (
        <View style={styles.contentRowContainer}>
          {iconLeft && (
            <Ionicons 
              name={iconLeft} 
              size={18} 
              color={getIconColor()} 
              style={styles.leftIconSpacer} 
            />
          )}
          
          <Text style={[styles.baseText, getTextStyle(), disabled && styles.textDisabled, textStyle]}>
            {title}
          </Text>

          {iconRight && (
            <Ionicons 
              name={iconRight} 
              size={18} 
              color={getIconColor()} 
              style={styles.rightIconSpacer} 
            />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  contentRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.82,
  },
  btnDisabled: {
    backgroundColor: '#E5E5EA',
    borderColor: '#E5E5EA',
  },
  
  // Variant Background Configurations
  btnPrimary: {
    backgroundColor: '#007AFF',
  },
  btnSecondary: {
    backgroundColor: '#34C759',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#007AFF',
  },
  btnText: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingHorizontal: 0,
  },
  btnDanger: {
    backgroundColor: '#FF3B30',
  },

  // Structural Text Stylings
  baseText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  textBaseColor: {
    color: '#FFFFFF',
  },
  textOutline: {
    color: '#007AFF',
  },
  textVariantOnly: {
    color: '#007AFF',
  },
  textDisabled: {
    color: '#AEAEB2',
  },

  // Spacing Metrics
  leftIconSpacer: {
    marginRight: 8,
  },
  rightIconSpacer: {
    marginLeft: 8,
  },
});