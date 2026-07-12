import ProviderRegistry from './ProviderRegistry';
import ErrorHandler from '../ErrorHandler';

class OCRService {
  /**
   * Initializes the active OCR Provider
   */
  static async initialize() {
    try {
      const provider = ProviderRegistry.getActiveProvider();
      await provider.initialize();
    } catch (error) {
      ErrorHandler.logError(error, { context: 'OCRService.initialize' });
      throw error;
    }
  }

  /**
   * Extracts text from an image using the active OCR Provider
   * @param {string} imageUri - URI of the image to process
   * @returns {Promise<string>} - Extracted text
   */
  static async extractText(imageUri) {
    try {
      const provider = ProviderRegistry.getActiveProvider();
      const text = await provider.extractText(imageUri);
      return text;
    } catch (error) {
      ErrorHandler.logError(error, { context: 'OCRService.extractText', imageUri });
      throw error;
    }
  }
}

export default OCRService;
