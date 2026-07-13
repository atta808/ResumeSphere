import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import PremiumButton from '../../components/common/PremiumButton';
import { portfolioService } from '../../services/portfolio/PortfolioService';

export default function PortfolioCustomizationScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { portfolioId } = route.params;

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const sections = [
    { id: 'about', label: 'About Me' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' }
  ];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await portfolioService.getPortfolioById(portfolioId);
        if (data) {
          setSettings(data.settings);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load customization settings');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [portfolioId]);

  const toggleSection = (sectionId) => {
    if (!settings) return;
    const hidden = settings.hiddenSections || [];
    const isHidden = hidden.includes(sectionId);

    let newHidden;
    if (isHidden) {
      newHidden = hidden.filter(id => id !== sectionId);
    } else {
      newHidden = [...hidden, sectionId];
    }

    setSettings({ ...settings, hiddenSections: newHidden });
  };

  const handleSave = async () => {
    try {
      await portfolioService.updatePortfolioSettings(portfolioId, {
        hiddenSections: settings.hiddenSections
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  if (loading || !settings) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Visible Sections</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Choose which sections appear on your portfolio.
        </Text>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {sections.map(section => {
            const isVisible = !(settings.hiddenSections || []).includes(section.id);
            return (
              <View key={section.id} style={[styles.row, { borderBottomColor: theme.border }]}>
                <Text style={[styles.rowText, { color: theme.textPrimary }]}>{section.label}</Text>
                <Switch
                  value={isVisible}
                  onValueChange={() => toggleSection(section.id)}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#fff"
                />
              </View>
            );
          })}
        </View>

        <PremiumButton title="Save Changes" onPress={handleSave} style={styles.saveButton} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  rowText: { fontSize: 16 },
  saveButton: { marginTop: 16 }
});
