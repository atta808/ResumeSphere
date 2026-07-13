import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, useWindowDimensions, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PremiumHeader, PremiumButton, Icon } from '../../components/common';
import { useTheme, spacing } from '../../theme';
import { ROUTES } from '../../navigation/routes';
import { DocumentService } from '../../services/documents';
import { useProfile } from '../../hooks/useProfile';
import RenderHtml from 'react-native-render-html';

import TemplateEngine from '../../services/templates/TemplateEngine';
import PDFService from '../../services/templates/PDFService';

const DocumentPreviewScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const { profile } = useProfile();
  const documentId = route.params?.documentId;

  const [document, setDocument] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');

  const loadDocument = useCallback(async () => {
    if (!documentId) return;
    try {
      const doc = await DocumentService.getDocumentById(documentId);
      setDocument(doc);

      // Render using StandardDocument template
      const resumeDataWrapper = { isDocument: true, profile, content: doc.content };
      const renderedHtml = await TemplateEngine.render(resumeDataWrapper, theme, {}, doc.templateId || 'StandardDocument');
      setHtmlContent(renderedHtml);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not load document.');
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
      console.error(error);
      Alert.alert('Export Error', 'Failed to export document.');
    }
  };

  if (!document) return <View style={[styles.container, { backgroundColor: theme.background }]} />;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader
        title={document.title}
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightIcon="pencil"
        onRightIconPress={() => navigation.navigate(ROUTES.DOCUMENT_EDITOR, { documentId })}
      />

      <ScrollView style={styles.content}>
        <View style={[styles.paper, { backgroundColor: '#fff', minHeight: width * 1.4 }]}>
           <RenderHtml
              contentWidth={width - 32}
              source={{ html: htmlContent }}
              baseStyle={{ color: '#000' }}
           />
        </View>
      </ScrollView>

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
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.md },
  paper: {
    padding: spacing.lg,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: spacing.xl,
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
