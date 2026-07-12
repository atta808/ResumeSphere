import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icon';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, radius, typography } from '../../theme';

const PremiumChip = ({
  label,
  onPress,
  onRemove,
  selected = false,
  variant = 'filled', // filled, outlined
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getStyles = () => {
    if (variant === 'outlined') {
      return {
        backgroundColor: selected ? theme.primary + '20' : 'transparent',
        borderColor: selected ? theme.primary : theme.border,
        borderWidth: 1,
        color: selected ? theme.primary : theme.textPrimary,
      };
    }
    // filled
    return {
      backgroundColor: selected ? theme.primary : theme.border,
      borderColor: 'transparent',
      borderWidth: 0,
      color: selected ? '#fff' : theme.textPrimary,
    };
  };

  const chipStyles = getStyles();

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[
        styles.container,
        {
          backgroundColor: chipStyles.backgroundColor,
          borderColor: chipStyles.borderColor,
          borderWidth: chipStyles.borderWidth,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[typography.bodySmall, { color: chipStyles.color }, textStyle]}>
        {label}
      </Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton} accessibilityLabel={`Remove ${label}`}>
          <Icon name="close-circle" size={16} color={chipStyles.color} />
        </TouchableOpacity>
      )}
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.round,
    alignSelf: 'flex-start',
  },
  removeButton: {
    marginLeft: spacing.xs,
  },
});

export default memo(PremiumChip);
