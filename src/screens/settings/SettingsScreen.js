import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PremiumHeader, PremiumCard, PremiumButton, Divider } from '../../components/common';
import { useTheme } from '../../theme';

const SettingsScreen = () => {
  const { theme, themeMode, setThemeMode } = useTheme();

  const toggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>
        <PremiumCard style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Theme</Text>
            <PremiumButton
              title={themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              variant="outline"
              size="small"
              onPress={toggleTheme}
            />
          </View>
        </PremiumCard>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 24 }]}>Account (Coming Soon)</Text>
        <PremiumCard style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Profile</Text>
            <Text style={{ color: theme.textSecondary }}>Setup later</Text>
          </View>
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Subscription</Text>
            <Text style={{ color: theme.textSecondary }}>Free</Text>
          </View>
        </PremiumCard>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 24 }]}>About</Text>
        <PremiumCard style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Version</Text>
            <Text style={{ color: theme.textSecondary }}>1.0.0</Text>
          </View>
        </PremiumCard>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SettingsScreen;
