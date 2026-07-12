import React, { memo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography } from '../../theme';

// Abstracted dimensional constants
const SIZES = {
  small: 32,
  medium: 48,
  large: 64,
  xl: 96,
};

const PremiumAvatar = ({
  source,
  initials,
  size = 'medium', // small, medium, large, xl
  onlineStatus, // 'online', 'offline', 'busy', 'away'
  style,
}) => {
  const { theme } = useTheme();

  const dimension = SIZES[size] || SIZES.medium;

  const getStatusColor = () => {
    switch (onlineStatus) {
      case 'online': return theme.success;
      case 'busy': return theme.danger;
      case 'away': return theme.warning;
      case 'offline':
      default: return theme.disabled;
    }
  };

  const statusSize = dimension * 0.25;

  return (
    <View style={[styles.container, { width: dimension, height: dimension }, style]}>
      {source ? (
        <Image
          source={source}
          style={[styles.image, { width: dimension, height: dimension, borderRadius: dimension / 2 }]}
          accessibilityRole="image"
        />
      ) : (
        <View style={[styles.initialsContainer, { width: dimension, height: dimension, borderRadius: dimension / 2, backgroundColor: theme.primary }]}>
          <Text style={[typography.title, { color: '#fff', fontSize: dimension * 0.4 }]}>
            {initials}
          </Text>
        </View>
      )}

      {onlineStatus && (
        <View
          style={[
            styles.statusIndicator,
            {
              width: statusSize,
              height: statusSize,
              borderRadius: statusSize / 2,
              backgroundColor: getStatusColor(),
              borderColor: theme.background,
              borderWidth: 2,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default memo(PremiumAvatar);
