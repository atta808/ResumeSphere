import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import Icon from './Icon';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, radius, typography, animations } from '../../theme';

const PremiumButton = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost, danger, success
  size = 'medium', // small, medium, large
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: theme.secondary, color: '#fff', borderColor: theme.secondary };
      case 'outline':
        return { backgroundColor: 'transparent', color: theme.primary, borderColor: theme.primary, borderWidth: 1 };
      case 'ghost':
        return { backgroundColor: 'transparent', color: theme.primary, borderColor: 'transparent' };
      case 'danger':
        return { backgroundColor: theme.danger, color: '#fff', borderColor: theme.danger };
      case 'success':
        return { backgroundColor: theme.success, color: '#fff', borderColor: theme.success };
      case 'primary':
      default:
        return { backgroundColor: theme.primary, color: '#fff', borderColor: theme.primary };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, fontSize: typography.bodySmall.fontSize };
      case 'large':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, fontSize: typography.h3.fontSize };
      case 'medium':
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, fontSize: typography.button.fontSize };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: variantStyles.backgroundColor,
      borderColor: variantStyles.borderColor,
      borderWidth: variant === 'outline' ? 1 : 0,
      borderRadius: radius.medium,
      paddingVertical: sizeStyles.paddingVertical,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.6 : 1,
    },
    style,
  ];

  const textStyles = [
    styles.text,
    typography.button,
    {
      color: variantStyles.color,
      fontSize: sizeStyles.fontSize,
      marginLeft: leftIcon ? spacing.sm : 0,
      marginRight: rightIcon ? spacing.sm : 0,
    },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.color} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon && <Icon name={leftIcon} size={sizeStyles.fontSize * 1.2} color={variantStyles.color} />}
          {title && <Text style={textStyles}>{title}</Text>}
          {rightIcon && <Icon name={rightIcon} size={sizeStyles.fontSize * 1.2} color={variantStyles.color} />}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default memo(PremiumButton);
