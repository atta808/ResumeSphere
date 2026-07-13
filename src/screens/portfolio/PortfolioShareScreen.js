import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import PremiumButton from '../../components/common/PremiumButton';
import Icon from '../../components/common/Icon';
import { ROUTES } from '../../navigation/routes';
import { portfolioService } from '../../services/portfolio/PortfolioService';
import { resumeService } from '../../services/resume/ResumeService';

export default function PortfolioShareScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { portfolioId } = route.params;

  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState(null);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const data = await portfolioService.getPortfolioById(portfolioId);
      const resumeData = await resumeService.getResumeById(data.portfolio.resumeId);
      const result = await portfolioService.publishPortfolio(portfolioId, resumeData);
      setPublishedUrl(result.url);
      Alert.alert('Success', 'Portfolio architecture prepared for cloud hosting.');
    } catch (error) {
      Alert.alert('Error', 'Failed to publish portfolio.');
    } finally {
      setPublishing(false);
    }
  };

  const handleExportHTML = async () => {
    try {
      const data = await portfolioService.getPortfolioById(portfolioId);
      const resumeData = await resumeService.getResumeById(data.portfolio.resumeId);
      await portfolioService.exportAndShareHTML(portfolioId, resumeData);
    } catch (error) {
      Alert.alert('Error', 'Failed to export HTML package.');
    }
  };

  const handleCopyLink = async () => {
    if (publishedUrl) {
      await Clipboard.setStringAsync(publishedUrl);
      Alert.alert('Copied', 'Portfolio link copied to clipboard.');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Icon name="rocket-launch" size={48} color={theme.primary} />
          <Text style={[styles.title, { color: theme.textPrimary }]}>Publish & Share</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Share your digital presence with the world.
          </Text>
        </View>

        {!publishedUrl ? (
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Ready to go live?</Text>
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
              Publishing prepares your portfolio for cloud hosting (Phase 15).
            </Text>
            <PremiumButton
              title={publishing ? "Publishing..." : "Publish Portfolio"}
              onPress={handlePublish}
              disabled={publishing}
              style={{ marginTop: 16 }}
            />
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.success }]}>
            <Text style={[styles.cardTitle, { color: theme.success }]}>Portfolio Published!</Text>
            <View style={[styles.linkBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.linkText, { color: theme.textPrimary }]} numberOfLines={1}>{publishedUrl}</Text>
            </View>
            <View style={styles.actionRow}>
              <PremiumButton title="Copy Link" onPress={handleCopyLink} variant="outline" style={styles.flexBtn} />
              <PremiumButton
                title="QR Code"
                onPress={() => navigation.navigate(ROUTES.QR_CODE, { url: publishedUrl, type: 'portfolio', portfolioId })}
                style={styles.flexBtn}
              />
            </View>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, marginTop: 24 }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Export Package</Text>
          <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
            Download the responsive HTML package to host it yourself or share it directly.
          </Text>
          <PremiumButton
            title="Export HTML"
            variant="outline"
            onPress={handleExportHTML}
            leftIcon={<Icon name="download" size={20} color={theme.primary} />}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: 8 },
  card: { padding: 20, borderRadius: 12, borderWidth: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardDesc: { fontSize: 14, lineHeight: 20 },
  linkBox: { padding: 12, borderRadius: 8, borderWidth: 1, marginVertical: 16 },
  linkText: { fontSize: 14 },
  actionRow: { flexDirection: 'row', gap: 12 },
  flexBtn: { flex: 1 }
});
