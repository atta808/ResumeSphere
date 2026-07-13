import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import ErrorHandler from '../ErrorHandler';
import { ERROR_CODES } from '../../constants/appConstants';

class PDFService {
  static async generatePDF(htmlContent) {
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });
      return uri;
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.EXPORT_ERROR);
    }
  }

  static async sharePDF(uri) {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri);
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.EXPORT_ERROR);
    }
  }

  static async savePDF(uri, filename = 'Resume.pdf') {
    try {
      const targetUri = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.copyAsync({
        from: uri,
        to: targetUri
      });
      return targetUri;
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.EXPORT_ERROR);
    }
  }
}

export default PDFService;
