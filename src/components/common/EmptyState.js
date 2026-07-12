import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, typography } from '../../theme';

const EmptyState = ({
  icon = 'inbox-outline',
  title,
  subtitle,
  actionButton,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Icon name={icon} size={64} color={theme.placeholder} style={styles.icon} />

      {title && (
        <Text style={[typography.h3, styles.title, { color: theme.textPrimary }]}>
          {title}
        </Text>
      )}

      {subtitle && (
        <Text style={[typography.body, styles.subtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}

      {actionButton && <View style={styles.actionContainer}>{actionButton}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  icon: {
    marginBottom: spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  actionContainer: {
    marginTop: spacing.md,
  },
});

export default memo(EmptyState);
