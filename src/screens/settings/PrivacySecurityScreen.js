import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PremiumHeader, PremiumCard, Divider } from '../../components/common';
import { useTheme } from '../../theme';
import { useNavigation } from '@react-navigation/native';

const PrivacySecurityScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Privacy & Security" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <PremiumCard style={styles.card}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Data Encryption</Text>
          <Divider style={styles.divider} />
          <Text style={[styles.text, { color: theme.textSecondary }]}>Your authentication tokens and sensitive metadata are securely encrypted using native device secure storage.</Text>
        </PremiumCard>

        <PremiumCard style={[styles.card, { marginTop: 16 }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Offline First Privacy</Text>
          <Divider style={styles.divider} />
          <Text style={[styles.text, { color: theme.textSecondary }]}>ResumeSphere is designed to work offline. Your primary data is stored locally in an SQLite database and is only synchronized when you enable Cloud Sync.</Text>
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
  text: { fontSize: 14, lineHeight: 20 },
});

export default PrivacySecurityScreen;
