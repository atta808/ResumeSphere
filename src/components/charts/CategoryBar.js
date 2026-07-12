import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from './ProgressBar';
import { useTheme, typography, spacing } from '../../theme';

const CategoryBar = ({ label, score }) => {
  const { theme } = useTheme();

  const getScoreColor = (val) => {
    if (val >= 90) return theme.success;
    if (val >= 75) return theme.info;
    if (val >= 60) return theme.warning;
    return theme.danger;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[typography.body, { color: theme.textPrimary, fontWeight: '500' }]}>{label}</Text>
        <Text style={[typography.body, { color: getScoreColor(score), fontWeight: 'bold' }]}>{score}/100</Text>
      </View>
      <ProgressBar progress={score} color={getScoreColor(score)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
});

export default CategoryBar;
