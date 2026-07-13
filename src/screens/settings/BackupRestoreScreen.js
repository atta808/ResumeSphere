import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PremiumHeader, PremiumCard, PremiumButton, Divider } from '../../components/common';
import { useTheme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { useCloudSync } from '../../hooks/useCloudSync';

const BackupRestoreScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { createBackup, restoreBackup } = useCloudSync();

  const handleBackup = async () => {
    try {
      await createBackup();
      alert('Backup completed successfully.');
    } catch(err) {
      alert('Backup failed.');
    }
  };

  const handleRestore = async () => {
    try {
      await restoreBackup('latest');
      alert('Restore completed successfully.');
    } catch(err) {
      alert('Restore failed.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Backup & Restore" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <PremiumCard style={styles.card}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Cloud Backup</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Safely back up your Career Profile, Resumes, and Activity Data to the cloud.</Text>
          <Divider style={styles.divider} />
          <View style={styles.buttonContainer}>
            <PremiumButton title="Create Manual Backup" onPress={handleBackup} />
          </View>
        </PremiumCard>

        <PremiumCard style={[styles.card, { marginTop: 16 }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Restore from Cloud</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Restore your local SQLite database from a recent cloud backup.</Text>
          <Divider style={styles.divider} />
          <View style={styles.buttonContainer}>
            <PremiumButton title="Restore Data" variant="outline" onPress={handleRestore} />
          </View>
        </PremiumCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  card: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 8 },
  divider: { marginVertical: 12 },
  buttonContainer: { marginTop: 8 },
});

export default BackupRestoreScreen;
