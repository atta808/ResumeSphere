import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../navigation/routes';
import { useTheme } from '../../theme';
import Icon from '../../components/common/Icon';
import { portfolioService } from '../../services/portfolio/PortfolioService';
import { resumeService } from '../../services/resume/ResumeService';
import Logger from '../../utils/logger';

export default function PortfolioPreviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { portfolioId } = route.params;

  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPreview = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getPortfolioById(portfolioId);
      if (!data) throw new Error('Portfolio not found');

      const resumeData = await resumeService.getResumeById(data.portfolio.resumeId);
      if (!resumeData) throw new Error('Resume data not found');

      const html = await portfolioService.previewPortfolio(portfolioId, resumeData);
      setHtmlContent(html);
    } catch (error) {
      Logger.error('Failed to load preview:', error);
      Alert.alert('Error', 'Could not generate portfolio preview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPreview();
    });
    return unsubscribe;
  }, [navigation, portfolioId]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.toolbar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.toolButton} onPress={() => navigation.navigate(ROUTES.PORTFOLIO_THEME, { portfolioId })}>
          <Icon name="palette" size={24} color={theme.primary} />
          <Text style={[styles.toolText, { color: theme.primary }]}>Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={() => navigation.navigate(ROUTES.PORTFOLIO_CUSTOMIZATION, { portfolioId })}>
          <Icon name="format-list-bulleted" size={24} color={theme.primary} />
          <Text style={[styles.toolText, { color: theme.primary }]}>Sections</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={() => navigation.navigate(ROUTES.PORTFOLIO_SHARE, { portfolioId })}>
          <Icon name="share-variant" size={24} color={theme.primary} />
          <Text style={[styles.toolText, { color: theme.primary }]}>Publish</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webview}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  toolButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
