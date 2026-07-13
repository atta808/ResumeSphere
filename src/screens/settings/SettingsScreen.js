import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PremiumHeader, PremiumCard, PremiumButton, Divider } from '../../components/common';
import { useTheme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../navigation/routes';

const SettingsScreen = () => {
  const navigation = useNavigation();
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

        <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 24 }]}>Account & Cloud</Text>
        <PremiumCard style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Account</Text>
            <PremiumButton title="Manage" variant="ghost" size="small" onPress={() => navigation.navigate(ROUTES.ACCOUNT)} />
          </View>
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Cloud Sync</Text>
            <PremiumButton title="View" variant="ghost" size="small" onPress={() => navigation.navigate(ROUTES.CLOUD_SYNC)} />
          </View>
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Backup & Restore</Text>
            <PremiumButton title="View" variant="ghost" size="small" onPress={() => navigation.navigate(ROUTES.BACKUP_RESTORE)} />
          </View>
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Connected Devices</Text>
            <PremiumButton title="View" variant="ghost" size="small" onPress={() => navigation.navigate(ROUTES.CONNECTED_DEVICES)} />
          </View>
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Privacy & Security</Text>
            <PremiumButton title="View" variant="ghost" size="small" onPress={() => navigation.navigate(ROUTES.PRIVACY_SECURITY)} />
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
