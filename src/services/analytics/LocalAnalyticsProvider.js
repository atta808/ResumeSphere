import { AnalyticsProvider } from './AnalyticsProvider';
import * as Crypto from 'expo-crypto';

export class LocalAnalyticsProvider extends AnalyticsProvider {
  constructor(db) {
    super();
    this.db = db;
  }

  async initialize() {
    // Database initialization is handled by migrations.
    return true;
  }

  async track(eventName, properties = {}) {
    if (!this.db) {
      console.warn('LocalAnalyticsProvider: db not initialized.');
      return;
    }

    try {
      const id = Crypto.randomUUID();
      const portfolioId = properties.portfolioId || null;
      const eventData = JSON.stringify(properties);
      const createdAt = new Date().toISOString();

      await this.db.runAsync(
        `INSERT INTO portfolio_analytics (id, portfolioId, eventType, eventData, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [id, portfolioId, eventName, eventData, createdAt]
      );
    } catch (error) {
      console.error('LocalAnalyticsProvider track error:', error);
    }
  }

  async setUserProperties(properties) {
    // Local analytics might not need to store user properties globally,
    // or could store them in a specific settings table.
    // For now, this is a no-op placeholder for future expansion.
  }
}
