import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumHeader, EmptyState } from '../../components/common';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme';

const ResumePreviewScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const resumeId = route.params?.resumeId;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Resume Preview" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <EmptyState
           title="Preview Generating..."
           subtitle="This is a placeholder for the future Template and Export Engine."
           icon="file-eye-outline"
        />
        <Text style={[typography.caption, {color: theme.textSecondary, textAlign: 'center', marginTop: spacing.xl}]}>
           Future architecture will load the PDF/Template view here for Resume ID: {resumeId}.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  }
});

export default ResumePreviewScreen;
