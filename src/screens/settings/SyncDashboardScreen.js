import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PremiumHeader, PremiumCard, PremiumButton, Divider } from '../../components/common';
import { useTheme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { useCloudSync } from '../../hooks/useCloudSync';

const SyncDashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { status, stats, syncNow } = useCloudSync();

  const formatDate = (isoString) => {
    if (!isoString) return 'Never';
    return new Date(isoString).toLocaleString();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Cloud Sync Dashboard" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <PremiumCard style={styles.card}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Overview</Text>
          <Divider style={styles.divider} />
          <Text style={[styles.label, { color: theme.textPrimary }]}>Current State: {status}</Text>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Last Sync: {formatDate(stats?.lastSyncTime)}</Text>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Connected Provider: Firebase</Text>
          <View style={styles.buttonContainer}>
            <PremiumButton title="Sync Now" onPress={syncNow} disabled={status === 'SYNCING'} />
          </View>
        </PremiumCard>

        <PremiumCard style={[styles.card, { marginTop: 16 }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Queue Status</Text>
          <Divider style={styles.divider} />
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {stats?.pendingCount || 0} item(s) pending.
          </Text>
          <Text style={[styles.label, { color: theme.error }]}>
            {stats?.failedCount || 0} item(s) failed.
          </Text>
        </PremiumCard>

        <PremiumCard style={[styles.card, { marginTop: 16 }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Backups</Text>
          <Divider style={styles.divider} />
          <Text style={[styles.label, { color: theme.textSecondary }]}>Last Backup: {formatDate(stats?.lastBackupTime)}</Text>
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
  divider: { marginVertical: 12 },
  label: { fontSize: 16, marginBottom: 8 },
  buttonContainer: { marginTop: 16 },
});

export default SyncDashboardScreen;
