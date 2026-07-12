import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme';
import {
  PremiumButton,
  PremiumCard,
  PremiumInput,
  PremiumHeader,
  PremiumBadge,
  PremiumChip,
  PremiumAvatar,
  Divider,
  SearchBar,
  SkeletonLoader,
  EmptyState,
  ToastProvider,
  useToast,
} from './src/components/common';

const DemoScreen = () => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { showToast } = useToast();
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  const toggleTheme = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
    showToast(`Switched to ${newMode} theme`, 'info');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PremiumHeader
        title="Design System Demo"
        subtitle="ResumeSphere AI Phase 2"
        rightAction={<PremiumButton title={themeMode === 'dark' ? '☀️' : '🌙'} onPress={toggleTheme} variant="ghost" size="small" />}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Typography & Colors</Text>
        <PremiumCard>
          <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Primary Color</Text>
          <Text style={{ color: theme.textPrimary, fontSize: 24, fontWeight: 'bold' }}>Heading Example</Text>
          <Text style={{ color: theme.textSecondary }}>This is secondary text to show contrast.</Text>
        </PremiumCard>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Buttons</Text>
        <View style={styles.row}>
          <PremiumButton title="Primary" onPress={() => showToast('Primary Clicked', 'success')} style={styles.element} />
          <PremiumButton title="Secondary" variant="secondary" onPress={() => showToast('Secondary Clicked')} style={styles.element} />
        </View>
        <View style={styles.row}>
          <PremiumButton title="Outline" variant="outline" onPress={() => {}} style={styles.element} />
          <PremiumButton title="Danger" variant="danger" onPress={() => showToast('Danger!', 'error')} style={styles.element} />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Inputs & Search</Text>
        <SearchBar
          value={searchValue}
          onChangeText={setSearchValue}
          onClear={() => setSearchValue('')}
          style={styles.element}
        />
        <PremiumInput
          label="Email Address"
          value={inputValue}
          onChangeText={setInputValue}
          leftIcon="email"
          placeholder="Enter your email"
        />
        <PremiumInput
          label="Password"
          isPassword
        />

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Badges & Chips</Text>
        <View style={styles.row}>
          <PremiumBadge text="Success" variant="success" style={styles.element} />
          <PremiumBadge text="Warning" variant="warning" style={styles.element} />
          <PremiumBadge text="Danger" variant="danger" style={styles.element} />
        </View>
        <View style={styles.row}>
          <PremiumChip label="Filled Chip" selected={true} style={styles.element} />
          <PremiumChip label="Outlined Chip" variant="outlined" style={styles.element} />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Avatar & Divider</Text>
        <View style={[styles.row, { alignItems: 'center' }]}>
          <PremiumAvatar initials="JD" size="large" onlineStatus="online" style={styles.element} />
          <PremiumAvatar initials="AI" size="medium" onlineStatus="busy" style={styles.element} />
        </View>
        <Divider style={{ marginVertical: 16 }} />

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Loaders & Empty State</Text>
        <SkeletonLoader type="card" style={{ marginBottom: 16 }} />

        <PremiumCard style={{ padding: 0 }}>
          <EmptyState
            title="No Resumes Found"
            subtitle="Create your first resume to get started."
            actionButton={<PremiumButton title="Create Resume" />}
          />
        </PremiumCard>

      </ScrollView>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <DemoScreen />
          </SafeAreaView>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

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
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  element: {
    marginRight: 8,
    marginBottom: 8,
  },
});
