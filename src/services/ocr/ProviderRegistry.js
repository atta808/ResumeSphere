import GoogleVisionProvider from './GoogleVisionProvider';

class OCRProviderRegistry {
  constructor() {
    this.providers = new Map();
    this.activeProviderId = null;
  }

  registerProvider(id, providerInstance) {
    this.providers.set(id, providerInstance);
  }

  setActiveProvider(id) {
    if (!this.providers.has(id)) {
      throw new Error(`OCR Provider ${id} not found in registry.`);
    }
    this.activeProviderId = id;
  }

  getActiveProvider() {
    if (!this.activeProviderId) {
      throw new Error('No active OCR provider set.');
    }
    return this.providers.get(this.activeProviderId);
  }
}

const registry = new OCRProviderRegistry();

// Auto-register and set Google Vision as default
const googleVision = new GoogleVisionProvider();
registry.registerProvider('google-vision', googleVision);
registry.setActiveProvider('google-vision');

export default registry;
