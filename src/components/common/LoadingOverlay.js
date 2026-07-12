import React, { memo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const LoadingOverlay = ({ visible, style }) => {
  const { theme } = useTheme();

  if (!visible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: theme.overlay }, style]}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensure it sits on top
  },
});

export default memo(LoadingOverlay);
