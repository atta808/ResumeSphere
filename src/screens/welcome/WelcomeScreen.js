import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { PremiumButton, PremiumCard, Icon } from '../../components/common';
import { useTheme } from '../../theme';
import { ROUTES } from '../../navigation/routes';

const WelcomeScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const handleGetStarted = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ROUTES.MAIN_TABS }],
      })
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Icon name="briefcase-outline" size={80} color={theme.primary} />
          <Text style={[styles.title, { color: theme.textPrimary }]}>ResumeSphere AI</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Build your professional resume powered by AI.
          </Text>
        </View>

        <PremiumCard style={styles.card}>
          <Text style={[styles.description, { color: theme.textPrimary }]}>
            Unlock your career potential with intelligent templates, ATS optimization, and AI cover letters.
          </Text>
          <PremiumButton
            title="Get Started"
            onPress={handleGetStarted}
            style={styles.button}
            size="large"
          />
        </PremiumCard>
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
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  card: {
    padding: 24,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
});

export default WelcomeScreen;
