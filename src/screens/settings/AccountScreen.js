import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PremiumHeader, PremiumCard, PremiumButton, Divider } from '../../components/common';
import { useTheme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';

const AccountScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Account" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <PremiumCard style={styles.card}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Profile</Text>
          <Divider style={styles.divider} />
          {user && !user.isGuest ? (
            <View>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Email: {user.email}</Text>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Status: Authenticated</Text>
              <View style={styles.buttonContainer}>
                <PremiumButton title="Sign Out" onPress={signOut} variant="outline" />
              </View>
            </View>
          ) : (
            <View>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Status: Guest Mode</Text>
              <View style={styles.buttonContainer}>
                <PremiumButton title="Sign In with Google" onPress={signInWithGoogle} />
              </View>
            </View>
          )}
        </PremiumCard>

        <PremiumCard style={[styles.card, { marginTop: 16 }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Subscription</Text>
          <Divider style={styles.divider} />
          <Text style={[styles.label, { color: theme.textSecondary }]}>Free Plan</Text>
        </PremiumCard>

        <PremiumCard style={[styles.card, { marginTop: 16 }]}>
          <Text style={[styles.title, { color: theme.error }]}>Danger Zone</Text>
          <Divider style={styles.divider} />
          <View style={styles.buttonContainer}>
             <PremiumButton title="Export Data" variant="outline" onPress={() => {}} />
             <PremiumButton title="Delete Account" variant="ghost" style={{marginTop: 8}} onPress={() => {}} />
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
  label: { fontSize: 16, marginBottom: 8 },
  buttonContainer: { marginTop: 16 },
});

export default AccountScreen;
