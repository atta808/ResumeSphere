import React, { useEffect, useRef, memo } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icon';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, radius, typography, shadows, animations } from '../../theme';

const Toast = ({ id, message, type = 'info', onDismiss, duration = 3000 }) => {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: animations.normal,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: animations.normal,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    let timeout;
    if (duration > 0) {
      timeout = setTimeout(() => {
        handleDismiss();
      }, duration);
    }

    return () => clearTimeout(timeout);
  }, []);

  const handleDismiss = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: animations.fast,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: animations.fast,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(id);
    });
  };

  const getStyleForType = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: theme.success, icon: 'check-circle' };
      case 'error':
        return { backgroundColor: theme.danger, icon: 'alert-circle' };
      case 'warning':
        return { backgroundColor: theme.warning, icon: 'alert' };
      case 'info':
      default:
        return { backgroundColor: theme.info, icon: 'information' };
    }
  };

  const typeStyles = getStyleForType();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: typeStyles.backgroundColor,
          transform: [{ translateY }],
          opacity,
          ...shadows.medium,
        },
      ]}
    >
      <Icon name={typeStyles.icon} size={24} color="#fff" style={styles.icon} />
      <Text style={[styles.message, typography.body, { color: '#fff' }]}>{message}</Text>

      <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
        <Icon name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.medium,
    marginBottom: spacing.sm,
    width: '90%',
    alignSelf: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  message: {
    flex: 1,
  },
  closeButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});

export default memo(Toast);
