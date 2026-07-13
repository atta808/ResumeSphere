import { MIGRATION_001 } from './Migration001';
import { MIGRATION_002 } from './Migration002';
import { MIGRATION_003 } from './Migration003';
import { MIGRATION_004 } from './Migration004';
import { MIGRATION_005 } from './Migration005';
import { MIGRATION_006 } from './Migration006';
import { MIGRATION_007 } from './Migration007';
import { MIGRATION_008 } from './Migration008';
import { MIGRATION_009 } from './Migration009';

class MigrationManager {
  static async runMigrations(db) {
    try {
      // Create migrations table if it doesn't exist
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version INTEGER PRIMARY KEY,
          executed_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);

      const currentVersionResult = await db.getFirstAsync(
        'SELECT MAX(version) as version FROM schema_migrations'
      );

      let currentVersion = currentVersionResult?.version || 0;

      // Define migrations sequentially
      const migrations = [
        { version: 1, query: MIGRATION_001 },
        { version: 2, query: MIGRATION_002 },
        { version: 3, query: MIGRATION_003 },
        { version: 4, query: MIGRATION_004 },
        { version: 5, query: MIGRATION_005 },
        { version: 6, query: MIGRATION_006 },
        { version: 7, query: MIGRATION_007 },
        { version: 8, query: MIGRATION_008 },
        { version: 9, query: MIGRATION_009 }
        // Future migrations go here
      ];

      for (const migration of migrations) {
        if (currentVersion < migration.version) {
          // Execute migration
          await db.execAsync(migration.query);

          // Record successful migration
          await db.runAsync(
            'INSERT INTO schema_migrations (version) VALUES (?)',
            [migration.version]
          );
          currentVersion = migration.version;
        }
      }
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}

export default MigrationManager;
