import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PremiumHeader, PremiumCard, Divider } from '../../components/common';
import { useTheme } from '../../theme';
import { useNavigation } from '@react-navigation/native';

const ConnectedDevicesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Connected Devices" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <PremiumCard style={styles.card}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Active Devices</Text>
          <Divider style={styles.divider} />
          <View style={styles.deviceRow}>
            <Text style={[styles.deviceName, { color: theme.textPrimary }]}>This Device</Text>
            <Text style={[styles.deviceStatus, { color: theme.primary }]}>Active</Text>
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
  divider: { marginVertical: 12 },
  deviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deviceName: { fontSize: 16 },
  deviceStatus: { fontSize: 14, fontWeight: 'bold' },
});

export default ConnectedDevicesScreen;
