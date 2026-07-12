import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PremiumHeader, EmptyState, PremiumButton } from '../../components/common';
import { useTheme } from '../../theme';

const CoverLetterScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader
        title="Cover Letter"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <EmptyState
          title="No Cover Letters"
          subtitle="Generate personalized cover letters tailored to specific jobs."
          icon="email-outline"
          actionButton={<PremiumButton title="Generate Cover Letter" />}
        />
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
    padding: 16,
  },
});

export default CoverLetterScreen;
