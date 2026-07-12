class BaseOCRProvider {
  /**
   * Initializes the OCR Provider
   */
  async initialize() {
    throw new Error('Method must be implemented');
  }

  /**
   * Extracts text from an image
   * @param {string} imageUri
   */
  async extractText(imageUri) {
    throw new Error('Method must be implemented');
  }
}

export default BaseOCRProvider;
