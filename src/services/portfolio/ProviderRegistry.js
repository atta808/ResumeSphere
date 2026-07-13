export class ProviderRegistry {
  constructor() {
    this.providers = new Map();
  }

  registerProvider(key, provider) {
    this.providers.set(key, provider);
  }

  getProvider(key) {
    return this.providers.get(key);
  }

  getAllProviders() {
    return Array.from(this.providers.values());
  }
}

export const portfolioProviderRegistry = new ProviderRegistry();
