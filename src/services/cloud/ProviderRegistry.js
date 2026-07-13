import { FirebaseCloudProvider } from './FirebaseCloudProvider';

class CloudProviderRegistry {
  constructor() {
    this.providers = {
      firebase: new FirebaseCloudProvider(),
    };
  }

  getProvider(name = 'firebase') {
    const provider = this.providers[name];
    if (!provider) {
      throw new Error(`Cloud Provider ${name} not found`);
    }
    return provider;
  }
}

export default new CloudProviderRegistry();
