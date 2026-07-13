import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../../theme';
import PremiumButton from '../../components/common/PremiumButton';
import Icon from '../../components/common/Icon';
import { portfolioService } from '../../services/portfolio/PortfolioService';

export default function QRCodeScreen() {
  const route = useRoute();
  const { theme } = useTheme();
  // `url` could be portfolio link, linkedin, etc.
  const { url = 'https://resumesphere.app', type = 'custom', portfolioId = null } = route.params || {};

  const svgRef = useRef();
  const [saved, setSaved] = useState(false);

  const handleSaveQR = async () => {
    try {
      await portfolioService.generateQRCode(url, type, portfolioId);
      setSaved(true);
      Alert.alert('Saved', 'QR Code saved to database.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save QR code');
    }
  };

  const handleShareQR = () => {
    svgRef.current.toDataURL(async (dataURL) => {
      try {
        const fileUri = `${FileSystem.cacheDirectory}qr_code.png`;
        await FileSystem.writeAsStringAsync(fileUri, dataURL, { encoding: FileSystem.EncodingType.Base64 });

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, { mimeType: 'image/png', dialogTitle: 'Share QR Code' });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to share QR code');
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.qrContainer, { backgroundColor: '#fff', borderColor: theme.border }]}>
        <QRCode
          value={url}
          size={250}
          getRef={c => (svgRef.current = c)}
          color="#000"
          backgroundColor="#fff"
        />
      </View>

      <Text style={[styles.urlText, { color: theme.textSecondary }]}>{url}</Text>

      <View style={styles.actions}>
        <PremiumButton
          title="Share Image"
          onPress={handleShareQR}
          leftIcon={<Icon name="share-variant" size={20} color="#fff" />}
          style={styles.button}
        />
        {!saved && (
          <PremiumButton
            title="Save QR"
            variant="outline"
            onPress={handleSaveQR}
            leftIcon={<Icon name="content-save" size={20} color={theme.primary} />}
            style={styles.button}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  qrContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 24,
  },
  urlText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  }
});
