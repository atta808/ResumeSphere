import React, { memo, useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from './Icon';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, radius, typography, animations } from '../../theme';

const PremiumInput = ({
  label,
  value,
  onChangeText,
  error,
  success,
  helperText,
  isPassword,
  leftIcon,
  rightIcon,
  multiline,
  maxLength,
  disabled,
  style,
  inputStyle,
  ...rest
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: animations.fast,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const getBorderColor = () => {
    if (disabled) return theme.disabled;
    if (error) return theme.danger;
    if (success) return theme.success;
    if (isFocused) return theme.primary;
    return theme.border;
  };

  const labelStyle = {
    position: 'absolute',
    left: leftIcon ? spacing.xl + spacing.md : spacing.md,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [spacing.md, -spacing.sm],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [typography.body.fontSize, typography.caption.fontSize],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.placeholder, theme.primary],
    }),
    backgroundColor: theme.surface,
    paddingHorizontal: spacing.xs,
    zIndex: 1,
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: disabled ? theme.background : theme.surface,
            opacity: disabled ? 0.7 : 1,
          }
        ]}
      >
        {leftIcon && (
          <Icon name={leftIcon} size={20} color={theme.textSecondary} style={styles.leftIcon} />
        )}

        <TextInput accessibilityLabel={label || placeholder || "Input field"}
          style={[
            styles.input,
            typography.body,
            { color: theme.textPrimary },
            leftIcon && { paddingLeft: spacing.xs },
            rightIcon || isPassword ? { paddingRight: spacing.xl + spacing.sm } : {},
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !showPassword}
          multiline={multiline}
          maxLength={maxLength}
          editable={!disabled}
          placeholderTextColor={theme.placeholder}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.rightIcon}>
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}

        {!isPassword && rightIcon && (
          <Icon name={rightIcon} size={20} color={theme.textSecondary} style={styles.rightIcon} />
        )}
      </View>

      <View style={styles.footer}>
        {error && <Text style={[styles.helperText, { color: theme.danger }]}>{error}</Text>}
        {!error && helperText && <Text style={[styles.helperText, { color: theme.textSecondary }]}>{helperText}</Text>}

        {maxLength && (
          <Text style={[styles.counter, { color: theme.textSecondary }]}>
            {value?.length || 0}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.medium,
    minHeight: 48, // Standard touch target
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  leftIcon: {
    marginLeft: spacing.md,
  },
  rightIcon: {
    position: 'absolute',
    right: spacing.md,
    height: '100%',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  helperText: {
    ...typography.caption,
    flex: 1,
  },
  counter: {
    ...typography.caption,
    marginLeft: spacing.sm,
  },
});

export default memo(PremiumInput);
