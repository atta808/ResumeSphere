import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const Divider = ({ orientation = 'horizontal', thickness = 1, style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        {
          backgroundColor: theme.divider,
          [orientation === 'horizontal' ? 'height' : 'width']: thickness,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
});

export default memo(Divider);
