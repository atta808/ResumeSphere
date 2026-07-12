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

export default new OCRProviderRegistry();
