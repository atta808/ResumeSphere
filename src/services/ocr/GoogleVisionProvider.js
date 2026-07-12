import BaseOCRProvider from './BaseOCRProvider';
import ENV from '../../config/env';
import * as FileSystem from 'expo-file-system';

class GoogleVisionProvider extends BaseOCRProvider {
  constructor() {
    super();
    this.apiKey = ENV.GOOGLE_VISION_API_KEY;
    this.apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`;
  }

  async initialize() {
    if (!this.apiKey) {
      throw new Error('Google Vision API key is missing');
    }
    // Perform any other necessary setup here
  }

  async extractText(imageUri) {
    if (!this.apiKey) {
      throw new Error('Google Vision API key is missing');
    }

    try {
      // 1. Read file as Base64
      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 2. Prepare payload
      const payload = {
        requests: [
          {
            image: {
              content: base64Data,
            },
            features: [
              {
                type: 'DOCUMENT_TEXT_DETECTION',
              },
            ],
          },
        ],
      };

      // 3. Make fetch request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ENV.API_TIMEOUT);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Google Vision API error: ${response.status}`);
      }

      const responseData = await response.json();

      const responses = responseData.responses;
      if (!responses || responses.length === 0) {
          throw new Error('No responses from Google Vision');
      }

      const textAnnotations = responses[0].textAnnotations;

      if (!textAnnotations || textAnnotations.length === 0) {
          return ''; // No text found
      }

      // The first annotation contains the entire extracted text
      return textAnnotations[0].description;

    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Google Vision API request timed out');
      }
      throw error;
    }
  }
}

export default GoogleVisionProvider;
