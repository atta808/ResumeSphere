import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

const ScreenWrapper = ({
  children,
  safeTop = false,
  safeBottom = false,
  backgroundColor,
  keyboardAware = false,
  style
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { backgroundColor: backgroundColor || theme.background },
    safeTop && { paddingTop: insets.top },
    safeBottom && { paddingBottom: insets.bottom },
    style
  ];

  if (keyboardAware) {
    return (
      <KeyboardAvoidingView
        style={containerStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenWrapper;
