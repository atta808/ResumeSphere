import BaseOCRProvider from './BaseOCRProvider';

class GoogleVisionProvider extends BaseOCRProvider {
  async initialize() {
    throw new Error('GoogleVisionProvider initialization not yet implemented');
  }

  async extractText(imageUri) {
    throw new Error('GoogleVisionProvider extractText not yet implemented');
  }
}

export default GoogleVisionProvider;
