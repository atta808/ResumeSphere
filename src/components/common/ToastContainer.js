import React, { memo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from './Toast';
import { spacing } from '../../theme';

const ToastContainer = ({ toasts, removeToast }) => {
  const insets = useSafeAreaInsets();

  const paddingTop = Platform.OS === 'ios' ? Math.max(insets.top, 44) : Math.max(insets.top, 20);

  return (
    <View style={[styles.container, { paddingTop }]} pointerEvents="box-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onDismiss={removeToast}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default memo(ToastContainer);
