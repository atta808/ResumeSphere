import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ImportService from '../../services/ocr/ImportService';
import { ROUTES } from '../../navigation/routes';
import Icon from '../../components/common/Icon';
import { useTheme } from '../../theme/ThemeContext';
import { lightTheme, darkTheme } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const ImportScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const handleImport = async (source) => {
    setLoading(true);
    try {
      const netInfo = await NetInfo.fetch();
      const isOffline = !netInfo.isConnected;

      let session = null;
      if (source === 'camera') {
        session = await ImportService.importFromCamera(isOffline);
      } else if (source === 'gallery') {
        session = await ImportService.importFromGallery(isOffline);
      } else if (source === 'pdf') {
        session = await ImportService.importFromPDF(isOffline);
      }

      if (isOffline && session) {
        Alert.alert('Offline', 'You are currently offline. The file has been queued for processing and will resume when you reconnect.');
      } else if (session) {
         navigation.navigate(ROUTES.IMPORT_REVIEW, { session });
      }
    } catch (error) {
      Alert.alert('Import Failed', error.message || 'An error occurred during import.');
    } finally {
      setLoading(false);
    }
  };

  const OptionButton = ({ title, icon, onPress, disabled }) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
        disabled && { opacity: 0.5 }
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Icon name={icon} size={28} color={theme.primary} />
      <Text style={[styles.optionTitle, { color: theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  const [isOfflineState, setIsOfflineState] = useState(false);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOfflineState(!state.isConnected);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Import Resume</Text>

      {isOfflineState && (
        <View style={styles.offlineBanner}>
          <Icon name="wifi-off" size={20} color="#fff" />
          <Text style={styles.offlineText}>You are offline. Imports will be queued.</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Processing document...</Text>
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          <OptionButton title="Camera" icon="camera" onPress={() => handleImport('camera')} />
          <OptionButton title="Gallery" icon="image" onPress={() => handleImport('gallery')} />
          <OptionButton title="PDF" icon="document-text" onPress={() => handleImport('pdf')} />
          <OptionButton title="DOCX (Coming Soon)" icon="document" disabled />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    ...typography.h2,
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  optionsContainer: {
    gap: spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionTitle: {
    ...typography.subtitle1,
    marginLeft: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body1,
    marginTop: spacing.md,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  offlineText: {
    ...typography.body2,
    color: '#fff',
    marginLeft: spacing.sm,
  }
});

export default ImportScreen;
