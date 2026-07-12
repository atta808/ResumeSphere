import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../../theme';

const ProgressBar = ({ progress = 0, height = 8, color, backgroundColor }) => {
  const { theme } = useTheme();
  const widthAnim = useSharedValue(0);

  useEffect(() => {
    widthAnim.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, widthAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${widthAnim.value}%`,
    };
  });

  return (
    <View style={[styles.container, { height, backgroundColor: backgroundColor || theme.divider, borderRadius: height / 2 }]}>
      <Animated.View
        style={[
          styles.bar,
          { height, backgroundColor: color || theme.primary, borderRadius: height / 2 },
          animatedStyle
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export default ProgressBar;
