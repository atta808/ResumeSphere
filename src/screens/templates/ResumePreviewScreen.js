import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Platform, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { PremiumHeader, PremiumButton, useToast } from '../../components/common';
import { useTheme, spacing } from '../../theme';
import ResumeService from '../../services/resume/ResumeService';
import ProfileService from '../../services/profile/ProfileService';
import TemplateEngine from '../../services/templates/TemplateEngine';
import PDFService from '../../services/templates/PDFService';
import { ColorSelector, FontSelector, TemplatePicker } from '../../components/templates';
import Logger from '../../utils/logger';

const { width } = Dimensions.get('window');

const ResumePreviewScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { showToast } = useToast();
  const resumeId = route.params?.resumeId;

  const [resumeData, setResumeData] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  const [templateId, setTemplateId] = useState('classic-ats');
  const [customization, setCustomization] = useState({
    primaryColor: '#0056b3',
    fontFamily: 'Inter, sans-serif'
  });

  const webviewRef = useRef(null);

  // Debounced Render
  useEffect(() => {
    let timeoutId;
    if (resumeData) {
      timeoutId = setTimeout(() => {
        renderPreview();
      }, 300);
    }
    return () => clearTimeout(timeoutId);
  }, [resumeData, templateId, customization, theme]);

  useEffect(() => {
    loadData();
  }, [resumeId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const resume = await ResumeService.getResumeById(resumeId);
      if (!resume) throw new Error('Resume not found');

      let fullProfileData = {};
      if (resume.profileId) {
        fullProfileData = await ProfileService.getFullProfile(resume.profileId);
      }

      const fullResumeData = {
         ...resume,
         profile: fullProfileData,
         experience: fullProfileData?.experience || [],
         education: fullProfileData?.education || [],
         skills: fullProfileData?.skills || [],
         projects: fullProfileData?.projects || [],
         languages: fullProfileData?.languages || [],
         certificates: fullProfileData?.certificates || [],
         awards: fullProfileData?.awards || [],
         references: fullProfileData?.references || [],
         customSections: fullProfileData?.customSections || []
      };

      const savedCustomization = await TemplateEngine.getCustomization(resumeId);
      if (savedCustomization && savedCustomization.templateId) {
        setTemplateId(savedCustomization.templateId);
        setCustomization({
          primaryColor: savedCustomization.primaryColor || '#0056b3',
          fontFamily: savedCustomization.fontFamily || 'Inter, sans-serif'
        });
      }

      setResumeData(fullResumeData);
    } catch (error) {
      showToast('Error loading resume data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = async () => {
    try {
      const html = await TemplateEngine.render(resumeData, theme, customization, templateId);
      setHtmlContent(html);
    } catch (error) {
      Logger.error(error);
      showToast('Error rendering preview', 'error');
    }
  };

  const handleSaveCustomization = async () => {
    try {
      await TemplateEngine.saveCustomization(resumeId, {
        templateId,
        primaryColor: customization.primaryColor,
        fontFamily: customization.fontFamily
      });
      showToast('Settings saved!', 'success');
    } catch (error) {
      showToast('Error saving settings', 'error');
    }
  };

  const handleExportPDF = async () => {
    try {
      setLoading(true);
      const uri = await PDFService.generatePDF(htmlContent);
      await PDFService.sharePDF(uri);
      showToast('PDF Exported successfully', 'success');
    } catch (error) {
      showToast('Export failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader title="Resume Preview" onBack={() => navigation.goBack()} />

      <View style={styles.workspace}>
        {/* Live Preview Area */}
        <View style={styles.previewContainer}>
          {loading && !htmlContent ? (
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

        {/* Customization Panel */}
        <View style={[styles.customizationPanel, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <ScrollView contentContainerStyle={styles.panelContent}>
            <TemplatePicker
              selectedId={templateId}
              onSelect={setTemplateId}
            />

            <ColorSelector
              label="Primary Color"
              selectedColor={customization.primaryColor}
              onSelectColor={(c) => setCustomization(prev => ({...prev, primaryColor: c}))}
            />

            <FontSelector
              selectedFont={customization.fontFamily}
              onSelectFont={(f) => setCustomization(prev => ({...prev, fontFamily: f}))}
            />

            <View style={styles.actionButtons}>
              <PremiumButton
                title="Save Settings"
                variant="secondary"
                onPress={handleSaveCustomization}
                style={{ flex: 1, marginRight: spacing.s }}
              />
              <PremiumButton
                title="Export PDF"
                onPress={handleExportPDF}
                style={{ flex: 1, marginLeft: spacing.s }}
                icon="export"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  workspace: {
    flex: 1,
    flexDirection: 'column', // Bottom sheet style for mobile
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    padding: spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewWrapper: {
    width: '100%',
    height: '100%',
    maxWidth: 800, // max width for desktop/tablet
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
  customizationPanel: {
    height: '40%', // Bottom sheet approach
    borderTopWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: spacing.m,
  },
  panelContent: {
    padding: spacing.m,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    paddingBottom: spacing.xl,
  }
});

export default ResumePreviewScreen;
