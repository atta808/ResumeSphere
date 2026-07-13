import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ROUTES } from '../../navigation/routes';
import { useTheme } from '../../theme';
import Icon from '../../components/common/Icon';
import PremiumButton from '../../components/common/PremiumButton';
import { portfolioService } from '../../services/portfolio/PortfolioService';
import { resumeService } from '../../services/resume/ResumeService';
import { profileService } from '../../services/profile/ProfileService';
import Logger from '../../utils/logger';

export default function PortfolioDashboardScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const profile = await profileService.getProfile();
      if (profile) {
        const userPortfolios = await portfolioService.getPortfolios(profile.id);
        setPortfolios(userPortfolios);
      }
    } catch (error) {
      Logger.error('Failed to load portfolios:', error);
      Alert.alert('Error', 'Could not load portfolios');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleCreatePortfolio = async () => {
    try {
      const profile = await profileService.getProfile();
      if (!profile) {
        Alert.alert('Profile Required', 'Please set up your profile first.');
        return;
      }

      // Check if user has resumes
      const resumes = await resumeService.getResumes();
      if (!resumes || resumes.length === 0) {
        Alert.alert('Resume Required', 'Please create a resume first to base your portfolio on.');
        return;
      }

      const defaultResume = resumes[0];
      const result = await portfolioService.createPortfolio(profile.id, defaultResume.id, {});
      navigation.navigate(ROUTES.PORTFOLIO_PREVIEW, { portfolioId: result.portfolio.id });
    } catch (error) {
      Logger.error('Error creating portfolio:', error);
      Alert.alert('Error', 'Could not create a new portfolio');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <Text style={{ color: theme.textPrimary, textAlign: 'center' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Icon name="web" size={48} color={theme.primary} />
        <Text style={[styles.title, { color: theme.textPrimary }]}>Digital Portfolios</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Manage your online presence and professional identity.
        </Text>
      </View>

      <PremiumButton
        title="Create New Portfolio"
        onPress={handleCreatePortfolio}
        style={styles.createButton}
        leftIcon={<Icon name="plus" size={20} color="#fff" />}
      />

      <View style={styles.list}>
        {portfolios.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No portfolios yet. Create one to get started!
          </Text>
        ) : (
          portfolios.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => navigation.navigate(ROUTES.PORTFOLIO_PREVIEW, { portfolioId: item.id })}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.name}</Text>
                <View style={[styles.badge, { backgroundColor: item.status === 'published' ? theme.success : theme.border }]}>
                  <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                {item.portfolioId}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  createButton: {
    marginBottom: 32,
  },
  list: {
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  }
});
