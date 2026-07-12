import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { spacing, radius, shadows } from '../../theme';

const PremiumCard = ({
  children,
  variant = 'elevated', // elevated, outlined, filled
  onPress,
  customPadding,
  rounded = 'medium',
  shadowLevel = 'medium',
  style,
  header,
  footer,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.border,
        };
      case 'filled':
        return {
          backgroundColor: theme.background, // Or a slightly different shade
        };
      case 'elevated':
      default:
        return {
          backgroundColor: theme.card,
          ...shadows[shadowLevel],
        };
    }
  };

  const getRadius = () => {
    return radius[rounded] || radius.medium;
  };

  const cardStyle = [
    styles.card,
    getVariantStyles(),
    {
      borderRadius: getRadius(),
      padding: customPadding !== undefined ? customPadding : spacing.md,
    },
    style,
  ];

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={cardStyle}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole={onPress ? 'button' : 'none'}
    >
      {header && <View style={[styles.header, { marginBottom: spacing.sm }]}>{header}</View>}
      <View style={styles.content}>{children}</View>
      {footer && <View style={[styles.footer, { marginTop: spacing.sm }]}>{footer}</View>}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  header: {
    // Styling for header if needed
  },
  content: {
    // Styling for content if needed
  },
  footer: {
    // Styling for footer if needed
  },
});

export default memo(PremiumCard);
