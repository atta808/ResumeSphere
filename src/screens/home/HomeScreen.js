import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PremiumHeader, PremiumCard, Icon } from '../../components/common';
import { useTheme } from '../../theme';
import { ROUTES } from '../../navigation/routes';

const HomeCard = ({ title, icon, onPress, theme }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
    <PremiumCard style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
        <Icon name={icon} size={28} color={theme.primary} />
      </View>
      <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{title}</Text>
    </PremiumCard>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Dashboard" subtitle="Welcome back" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Features</Text>

        <View style={styles.grid}>
          <HomeCard
            title="Resume Builder"
            icon="file-document-outline"
            onPress={() => navigation.navigate(ROUTES.RESUME)}
            theme={theme}
          />
          <HomeCard
            title="AI Assistant"
            icon="robot-outline"
            onPress={() => navigation.navigate(ROUTES.AI_ASSISTANT)}
            theme={theme}
          />
          <HomeCard
            title="Templates"
            icon="view-grid-outline"
            onPress={() => navigation.navigate(ROUTES.TEMPLATES)}
            theme={theme}
          />
          <HomeCard
            title="Settings"
            icon="cog-outline"
            onPress={() => navigation.navigate(ROUTES.SETTINGS)}
            theme={theme}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: 24 }]}>Pro Tools</Text>

        <View style={styles.grid}>
          <HomeCard
            title="ATS Score"
            icon="chart-line"
            onPress={() => navigation.navigate(ROUTES.ATS_SCORE)}
            theme={theme}
          />
          <HomeCard
            title="Cover Letter"
            icon="email-outline"
            onPress={() => navigation.navigate(ROUTES.COVER_LETTER)}
            theme={theme}
          />
          <HomeCard
            title="Interview Prep"
            icon="microphone-outline"
            onPress={() => navigation.navigate(ROUTES.INTERVIEW_PREP)}
            theme={theme}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HomeScreen;
