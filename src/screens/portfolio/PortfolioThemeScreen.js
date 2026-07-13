import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import PremiumButton from '../../components/common/PremiumButton';
import { portfolioService } from '../../services/portfolio/PortfolioService';

export default function PortfolioThemeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { portfolioId } = route.params;

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const colors = [
    { label: 'Blue', value: '#007AFF' },
    { label: 'Green', value: '#34C759' },
    { label: 'Indigo', value: '#5856D6' },
    { label: 'Orange', value: '#FF9500' },
    { label: 'Red', value: '#FF3B30' },
    { label: 'Teal', value: '#5AC8FA' }
  ];

  const modes = ['light', 'dark'];
  const fonts = ['sans', 'serif', 'mono'];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await portfolioService.getPortfolioById(portfolioId);
        if (data) {
          setSettings(data.settings);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load theme settings');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [portfolioId]);

  const handleSave = async () => {
    try {
      await portfolioService.updatePortfolioSettings(portfolioId, {
        theme: settings.theme,
        primaryColor: settings.primaryColor,
        typography: settings.typography
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save theme settings');
    }
  };

  if (loading || !settings) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Color Mode</Text>
        <View style={styles.optionsRow}>
          {modes.map(mode => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.optionBox,
                {
                  backgroundColor: theme.surface,
                  borderColor: settings.theme === mode ? theme.primary : theme.border,
                  borderWidth: settings.theme === mode ? 2 : 1
                }
              ]}
              onPress={() => setSettings({ ...settings, theme: mode })}
            >
              <Text style={{ color: theme.textPrimary, textTransform: 'capitalize' }}>{mode}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Primary Color</Text>
        <View style={styles.colorGrid}>
          {colors.map(color => (
            <TouchableOpacity
              key={color.value}
              style={[
                styles.colorCircle,
                { backgroundColor: color.value },
                settings.primaryColor === color.value && styles.colorCircleSelected
              ]}
              onPress={() => setSettings({ ...settings, primaryColor: color.value })}
            />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Typography</Text>
        <View style={styles.optionsRow}>
          {fonts.map(font => (
            <TouchableOpacity
              key={font}
              style={[
                styles.optionBox,
                {
                  backgroundColor: theme.surface,
                  borderColor: settings.typography === font ? theme.primary : theme.border,
                  borderWidth: settings.typography === font ? 2 : 1
                }
              ]}
              onPress={() => setSettings({ ...settings, typography: font })}
            >
              <Text style={{ color: theme.textPrimary, textTransform: 'capitalize' }}>{font}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <PremiumButton title="Apply Theme" onPress={handleSave} style={styles.saveButton} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  optionsRow: { flexDirection: 'row', gap: 12 },
  optionBox: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButton: { marginTop: 40 }
});
