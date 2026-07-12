import React, { memo, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { radius, spacing, animations } from '../../theme';

// A simple reusable shimmer using Animated
const SkeletonItem = ({ style, rounded }) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: animations.slow * 2,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: animations.slow * 2,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: theme.placeholder,
          opacity,
          borderRadius: rounded ? radius.round : radius.medium,
        },
        style,
      ]}
    />
  );
};

const SkeletonLoader = ({ type = 'text', style }) => {
  switch (type) {
    case 'card':
      return (
        <View style={[styles.cardContainer, style]}>
          <SkeletonItem style={styles.cardImage} />
          <SkeletonItem style={styles.cardTitle} />
          <SkeletonItem style={styles.cardSubtitle} />
        </View>
      );
    case 'profile':
      return (
        <View style={[styles.profileContainer, style]}>
          <SkeletonItem style={styles.profileAvatar} rounded />
          <View style={styles.profileTextContainer}>
            <SkeletonItem style={styles.profileTitle} />
            <SkeletonItem style={styles.profileSubtitle} />
          </View>
        </View>
      );
    case 'list':
      return (
        <View style={[styles.listContainer, style]}>
          <SkeletonItem style={styles.listAvatar} rounded />
          <View style={styles.listTextContainer}>
            <SkeletonItem style={styles.listTitle} />
            <SkeletonItem style={styles.listSubtitle} />
          </View>
        </View>
      );
    case 'text':
    default:
      return <SkeletonItem style={[styles.text, style]} />;
  }
};

const styles = StyleSheet.create({
  // Card
  cardContainer: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardImage: {
    height: 150,
    width: '100%',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    height: 20,
    width: '60%',
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    height: 16,
    width: '40%',
  },
  // Profile
  profileContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
  },
  profileTextContainer: {
    alignItems: 'center',
    width: '100%',
  },
  profileTitle: {
    height: 24,
    width: '50%',
    marginBottom: spacing.xs,
  },
  profileSubtitle: {
    height: 16,
    width: '30%',
  },
  // List
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  listAvatar: {
    width: 48,
    height: 48,
    marginRight: spacing.md,
  },
  listTextContainer: {
    flex: 1,
  },
  listTitle: {
    height: 20,
    width: '70%',
    marginBottom: spacing.xs,
  },
  listSubtitle: {
    height: 16,
    width: '40%',
  },
  // Text
  text: {
    height: 16,
    width: '100%',
    marginVertical: spacing.xs,
  }
});

export default memo(SkeletonLoader);
