import * as SQLite from 'expo-sqlite';
import ENV from '../config/env';
import ErrorHandler from '../services/ErrorHandler';
import MigrationManager from './migrations/MigrationManager';

class DatabaseManager {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    try {
      this.db = await SQLite.openDatabaseAsync(ENV.DB_NAME);

      // Run migrations
      await MigrationManager.runMigrations(this.db);

      this.isInitialized = true;
    } catch (error) {
      ErrorHandler.logError(error, { context: 'DatabaseManager.init' });
      throw error;
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }
}

const dbManager = new DatabaseManager();
export default dbManager;
