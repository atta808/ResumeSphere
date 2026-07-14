import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Alert, useWindowDimensions, ActivityIndicator, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { PremiumHeader, PremiumButton } from '../../components/common';
import { useTheme, spacing } from '../../theme';
import { ROUTES } from '../../navigation/routes';
import { DocumentService } from '../../services/documents';
import { useProfile } from '../../hooks/useProfile';

import TemplateEngine from '../../services/templates/TemplateEngine';
import PDFService from '../../services/templates/PDFService';
import Logger from '../../utils/logger';

const DocumentPreviewScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const { profile } = useProfile();
  const documentId = route.params?.documentId;

  const [document, setDocument] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  const webviewRef = useRef(null);

  const loadDocument = useCallback(async () => {
    if (!documentId) return;
    try {
      setLoading(true);
      const doc = await DocumentService.getDocumentById(documentId);
      setDocument(doc);

      // Render using StandardDocument template
      const resumeDataWrapper = { isDocument: true, profile, content: doc.content };
      const renderedHtml = await TemplateEngine.render(resumeDataWrapper, theme, {}, doc.templateId || 'StandardDocument');
      setHtmlContent(renderedHtml);
    } catch (error) {
      Logger.error(error);
      Alert.alert('Error', 'Could not load document.');
    } finally {
      setLoading(false);
    }
  }, [documentId, profile, theme]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const handleExport = async () => {
    try {
      const uri = await PDFService.generatePDF(htmlContent);
      await PDFService.sharePDF(uri);
    } catch (error) {
      Logger.error(error);
      Alert.alert('Export Error', 'Failed to export document.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader
        title={document?.title || "Document Preview"}
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightIcon="pencil"
        onRightIconPress={() => navigation.navigate(ROUTES.DOCUMENT_EDITOR, { documentId })}
      />

      <View style={styles.workspace}>
        <View style={styles.previewContainer}>
          {loading || !htmlContent ? (
            <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.webviewWrapper}>
              <WebView
                ref={webviewRef}
                source={{ html: htmlContent }}
                style={styles.webview}
                scalesPageToFit={Platform.OS === 'android'}
                bounces={false}
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
              />
            </View>
          )}
        </View>
      </View>

      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <PremiumButton
          title="Export PDF"
          onPress={handleExport}
          style={styles.exportBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  workspace: {
    flex: 1,
    flexDirection: 'column',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewWrapper: {
    width: '100%',
    height: '100%',
    maxWidth: 800,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
  },
  exportBtn: {
    width: '100%',
  }
});

export default DocumentPreviewScreen;
