import dbManager from '../../database/sqlite';
import * as Crypto from 'expo-crypto';

export class CloudRepository {
  async getSyncQueue() {
    const db = dbManager.getDb();
    return await db.getAllAsync(`SELECT * FROM sync_queue ORDER BY createdAt ASC`);
  }

  async getSyncLogs() {
    const db = dbManager.getDb();
    return await db.getAllAsync(`SELECT * FROM sync_logs ORDER BY createdAt DESC LIMIT 50`);
  }

  async getBackups() {
    const db = dbManager.getDb();
    return await db.getAllAsync(`SELECT * FROM cloud_backups ORDER BY createdAt DESC`);
  }

  async enqueueChange(id, entityType, entityId, operation, payload, now) {
    const db = dbManager.getDb();
    await db.runAsync(
      `INSERT INTO sync_queue (id, entityType, entityId, operation, payload, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, entityType, entityId, operation, payload, now, now]
    );
  }

  async getPendingChanges() {
    const db = dbManager.getDb();
    return await db.getAllAsync(
      `SELECT * FROM sync_queue WHERE status = 'PENDING' ORDER BY createdAt ASC`
    );
  }

  async getFailedChanges() {
    const db = dbManager.getDb();
    return await db.getAllAsync(
      `SELECT * FROM sync_queue WHERE status = 'FAILED' ORDER BY createdAt DESC`
    );
  }

  async getLastSyncTime() {
    const db = dbManager.getDb();
    const result = await db.getFirstAsync(
      `SELECT MAX(lastSyncedAt) as lastSync FROM sync_metadata`
    );
    return result?.lastSync || null;
  }

  async recordBackup(backupId, type, size) {
    const db = dbManager.getDb();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO cloud_backups (id, backupId, type, status, size, createdAt, completedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [Crypto.randomUUID(), backupId, type, 'COMPLETED', size, now, now]
    );
  }

  async getLastBackup() {
    const db = dbManager.getDb();
    return await db.getFirstAsync(
      `SELECT * FROM cloud_backups WHERE status = 'COMPLETED' ORDER BY createdAt DESC LIMIT 1`
    );
  }

  async markAsSynced(id, now) {
    const db = dbManager.getDb();
    await db.runAsync(
      `UPDATE sync_queue SET status = 'SYNCED', updatedAt = ? WHERE id = ?`,
      [now, id]
    );
  }

  async updateSyncMetadata(entityType, entityId, cloudId, now) {
    const db = dbManager.getDb();
    await db.runAsync(
      `INSERT INTO sync_metadata (id, entityType, entityId, cloudId, syncStatus, lastSyncedAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(entityType, entityId) DO UPDATE SET
       cloudId = excluded.cloudId,
       syncStatus = excluded.syncStatus,
       lastSyncedAt = excluded.lastSyncedAt,
       updatedAt = excluded.updatedAt`,
      [Crypto.randomUUID(), entityType, entityId, cloudId, 'SYNCED', now, now]
    );
  }

  async markAsFailed(id, errorMessage, now) {
    const db = dbManager.getDb();
    await db.runAsync(
      `UPDATE sync_queue SET status = 'FAILED', errorMessage = ?, updatedAt = ?, retryCount = retryCount + 1 WHERE id = ?`,
      [errorMessage, now, id]
    );
  }

  async exportFullDatabase() {
    const db = dbManager.getDb();
    const tables = [
      'profiles', 'resumes', 'ats_history', 'ocr_history',
      'job_descriptions', 'job_matches', 'documents',
      'interview_sessions', 'career_goals', 'learning_progress',
      'portfolios', 'portfolio_settings', 'qr_codes',
      'user_preferences', 'ai_history'
    ];

    const exportData = {};
    for (const table of tables) {
      try {
        exportData[table] = await db.getAllAsync(`SELECT * FROM ${table}`);
      } catch (e) {
        // Table might not exist yet if using older schema or missing migration.
        // We log and continue so backup doesn't fail entirely.
        exportData[table] = [];
      }
    }
    return exportData;
  }

  async restoreFullDatabase(backupData) {
    const db = dbManager.getDb();
    await db.withTransactionAsync(async () => {
      // For each table in the backup
      for (const [table, rows] of Object.entries(backupData)) {
        if (!Array.isArray(rows) || rows.length === 0) continue;

        // Wipe existing table data
        await db.runAsync(`DELETE FROM ${table}`);

        // Insert new data
        const keys = Object.keys(rows[0]);
        const placeholders = keys.map(() => '?').join(', ');
        const quotedKeys = keys.map(k => `"${k}"`).join(', ');
        const query = `INSERT INTO ${table} (${quotedKeys}) VALUES (${placeholders})`;

        for (const row of rows) {
          const values = Object.values(row);
          await db.runAsync(query, values);
        }
      }
    });
  }
}

export default new CloudRepository();
