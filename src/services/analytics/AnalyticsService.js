class AnalyticsService {
  constructor() {
    this.providers = [];
    this.initialized = false;
  }

  /**
   * Registers a new analytics provider.
   * @param {AnalyticsProvider} provider The provider to register.
   */
  registerProvider(provider) {
    this.providers.push(provider);
  }

  /**
   * Initializes all registered providers.
   */
  async initialize() {
    if (this.initialized) return;

    for (const provider of this.providers) {
      try {
        await provider.initialize();
      } catch (error) {
        console.error('Failed to initialize analytics provider:', error);
      }
    }
    this.initialized = true;
  }

  /**
   * Tracks an event across all providers.
   * @param {string} eventName The event name to track.
   * @param {object} properties Properties to send with the event.
   */
  async track(eventName, properties = {}) {
    if (!this.initialized) {
      console.warn('AnalyticsService: tracking event before initialization');
    }

    const promises = this.providers.map(provider =>
      provider.track(eventName, properties).catch(error => {
        console.error(`Provider tracking failed for event: ${eventName}`, error);
      })
    );
    await Promise.all(promises);
  }

  /**
   * Sets user properties across all providers.
   * @param {object} properties User properties to set.
   */
  async setUserProperties(properties) {
    const promises = this.providers.map(provider =>
      provider.setUserProperties(properties).catch(error => {
        console.error(`Provider user properties failed`, error);
      })
    );
    await Promise.all(promises);
  }
}

// Export singleton instance
import SQLiteService from '../../database/sqlite';
import { LocalAnalyticsProvider } from './LocalAnalyticsProvider';

const baseInstance = new AnalyticsService();
let isLocalProviderRegistered = false;

export const analyticsService = new Proxy(baseInstance, {
  get(target, prop) {
    // Lazy initialization of the local provider to ensure DB is ready
    if (!isLocalProviderRegistered && SQLiteService.db) {
      target.registerProvider(new LocalAnalyticsProvider(SQLiteService.db));
      target.initialize();
      isLocalProviderRegistered = true;
    }

    // Bind functions to target to maintain correct 'this' context
    const value = target[prop];
    if (typeof value === 'function') {
      return value.bind(target);
    }
    return value;
  }
});
