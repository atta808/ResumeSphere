import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icon';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography } from '../../theme';

const PremiumHeader = ({
  title,
  subtitle,
  onBack,
  leftAction,
  rightAction,
  themeAware = true,
}) => {
  const { theme } = useTheme();
  // We handle Safe Area implicitly by expecting this to be used within a SafeAreaView,
  // or we can add optional padding. For robustness without installing an extra package right now,
  // we will just use padding if provided or assume container handles it.

  return (
    <View style={[styles.container, { backgroundColor: themeAware ? theme.surface : 'transparent', borderBottomColor: themeAware ? theme.divider : 'transparent' }]}>
      <View style={styles.leftContainer}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.actionButton} accessibilityLabel="Go back">
            <Icon name="arrow-left" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        )}
        {!onBack && leftAction && (
          <View style={styles.actionButton}>{leftAction}</View>
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={[typography.title, { color: theme.textPrimary }]} numberOfLines={1}>{title}</Text>
        {subtitle && (
          <Text style={[typography.caption, { color: theme.textSecondary }]} numberOfLines={1}>{subtitle}</Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightAction && <View style={styles.actionButton}>{rightAction}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  actionButton: {
    padding: spacing.xs,
  },
});

export default memo(PremiumHeader);
