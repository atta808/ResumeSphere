import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PremiumHeader, PremiumCard, Icon, EmptyState } from '../../components/common';
import { useTheme } from '../../theme';
import CareerCoachService from '../../services/career/CareerCoachService';
import { useProfile } from '../../hooks/useProfile';

const CertificationScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { profile } = useProfile();

  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    if (profile?.id) {
       CareerCoachService.getDashboardState(profile.id).then(data => {
           setCertifications(data?.certifications || []);
       });
    }
  }, [profile?.id]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Certifications" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>

        {certifications.length === 0 ? (
            <EmptyState title="No Recommendations" subtitle="Generate your career plan first." icon="ribbon-outline" />
        ) : (
            certifications.map((item) => (
                <PremiumCard key={item.id} style={styles.card}>
                    <View style={styles.header}>
                        <Icon name="ribbon" size={24} color={theme.primary} />
                        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                    </View>
                    <Text style={[styles.provider, { color: theme.textSecondary }]}>{item.provider || item.description}</Text>
                    {item.estimatedImpact && (
                        <View style={styles.impactBadge}>
                            <Text style={styles.impactText}>{item.estimatedImpact}</Text>
                        </View>
                    )}
                </PremiumCard>
            ))
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  card: { padding: 16, marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '600', marginLeft: 10, flex: 1 },
  provider: { fontSize: 14, marginBottom: 12 },
  impactBadge: { backgroundColor: '#E0F2FE', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  impactText: { color: '#0369A1', fontSize: 12, fontWeight: '600' }
});

export default CertificationScreen;
