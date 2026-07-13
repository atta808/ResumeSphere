import { FirebaseAuthProvider } from './FirebaseAuthProvider';

class ProviderRegistry {
  constructor() {
    this.providers = {
      firebase: new FirebaseAuthProvider(),
      // Add 'supabase', 'aws', etc. here later
    };
  }

  getProvider(name = 'firebase') {
    const provider = this.providers[name];
    if (!provider) {
      throw new Error(`Auth Provider ${name} not found`);
    }
    return provider;
  }
}

export default new ProviderRegistry();
