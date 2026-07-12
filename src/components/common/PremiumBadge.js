import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, radius, typography } from '../../theme';

const PremiumBadge = ({
  text,
  variant = 'neutral', // success, danger, warning, info, neutral
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: theme.success, color: '#fff' };
      case 'danger':
        return { backgroundColor: theme.danger, color: '#fff' };
      case 'warning':
        return { backgroundColor: theme.warning, color: '#fff' };
      case 'info':
        return { backgroundColor: theme.info, color: '#fff' };
      case 'neutral':
      default:
        return { backgroundColor: theme.disabled, color: theme.textPrimary };
    }
  };

  const styles = getVariantStyles();

  return (
    <View style={[badgeStyles.container, { backgroundColor: styles.backgroundColor }, style]}>
      <Text style={[typography.caption, { color: styles.color, fontWeight: 'bold' }, textStyle]}>
        {text}
      </Text>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.round,
    alignSelf: 'flex-start',
  },
});

export default memo(PremiumBadge);
