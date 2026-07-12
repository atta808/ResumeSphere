class ProviderRegistry {
  constructor() {
    this.providers = new Map();
    this.defaultProvider = null;
  }

  registerProvider(name, provider, isDefault = false) {
    this.providers.set(name, provider);
    if (isDefault || !this.defaultProvider) {
      this.defaultProvider = name;
    }
  }

  getProvider(name) {
    const providerName = name || this.defaultProvider;
    const provider = this.providers.get(providerName);

    if (!provider) {
        throw new Error(`ATS Provider '${providerName}' not found`);
    }

    return provider;
  }
}

export default new ProviderRegistry();
