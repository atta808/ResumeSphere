class ProviderRegistry {
  constructor() {
    this.providers = new Map();
    this.activeProviders = new Map();
  }

  registerProvider(type, name, provider) {
    if (!this.providers.has(type)) {
      this.providers.set(type, new Map());
    }
    this.providers.get(type).set(name, provider);
  }

  setActiveProvider(type, name) {
    if (!this.providers.has(type) || !this.providers.get(type).has(name)) {
      throw new Error(`Provider ${name} of type ${type} not found`);
    }
    this.activeProviders.set(type, name);
  }

  getActiveProvider(type) {
    const activeName = this.activeProviders.get(type);
    if (!activeName) {
      throw new Error(`No active provider set for type ${type}`);
    }
    return this.providers.get(type).get(activeName);
  }
}

export default new ProviderRegistry();
