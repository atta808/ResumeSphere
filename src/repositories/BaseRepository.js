import dbManager from '../database/sqlite';
import ErrorHandler from '../services/ErrorHandler';
import { ERROR_CODES } from '../constants/appConstants';
import OfflineQueueService from '../services/cloud/OfflineQueueService';

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
  }

  get db() {
    return dbManager.getDb();
  }

  async findById(id) {
    try {
      return await this.db.getFirstAsync(
        `SELECT * FROM ${this.tableName} WHERE id = ? AND deletedAt IS NULL`,
        [id]
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async findAll(profileId = null) {
    try {
      if (profileId) {
        return await this.db.getAllAsync(
          `SELECT * FROM ${this.tableName} WHERE profileId = ? AND deletedAt IS NULL ORDER BY "order" ASC`,
          [profileId]
        );
      }
      return await this.db.getAllAsync(
        `SELECT * FROM ${this.tableName} WHERE deletedAt IS NULL`
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async create(data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);

      const placeholders = keys.map(() => '?').join(', ');
      // Quote keys in case of reserved keywords like 'order'
      const quotedKeys = keys.map(k => `"${k}"`).join(', ');

      const query = `INSERT INTO ${this.tableName} (${quotedKeys}) VALUES (${placeholders})`;

      await this.db.runAsync(query, values);

      // Enqueue sync operation
      try {
        await OfflineQueueService.enqueueChange(this.tableName, data.id, 'CREATE', data);
      } catch (syncErr) {
        ErrorHandler.logError(syncErr, { context: 'BaseRepository.create.sync' });
      }

      return data;
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async update(id, data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);

      const setClause = keys.map(k => `"${k}" = ?`).join(', ');

      const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;

      await this.db.runAsync(query, [...values, id]);
      const updatedData = await this.findById(id);

      // Enqueue sync operation
      try {
        await OfflineQueueService.enqueueChange(this.tableName, id, 'UPDATE', updatedData);
      } catch (syncErr) {
        ErrorHandler.logError(syncErr, { context: 'BaseRepository.update.sync' });
      }

      return updatedData;
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async delete(id, softDelete = true) {
    try {
      if (softDelete) {
        const now = new Date().toISOString();
        await this.db.runAsync(
          `UPDATE ${this.tableName} SET deletedAt = ? WHERE id = ?`,
          [now, id]
        );
      } else {
        await this.db.runAsync(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
      }

      // Enqueue sync operation
      try {
        await OfflineQueueService.enqueueChange(this.tableName, id, 'DELETE', { id, softDelete });
      } catch (syncErr) {
        ErrorHandler.logError(syncErr, { context: 'BaseRepository.delete.sync' });
      }

      return true;
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async count(profileId = null) {
    try {
      if (profileId) {
         const result = await this.db.getFirstAsync(
           `SELECT COUNT(*) as count FROM ${this.tableName} WHERE profileId = ? AND deletedAt IS NULL`,
           [profileId]
         );
         return result?.count || 0;
      }
      const result = await this.db.getFirstAsync(
        `SELECT COUNT(*) as count FROM ${this.tableName} WHERE deletedAt IS NULL`
      );
      return result?.count || 0;
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async search(queryStr, profileId = null) {
    try {
      // Basic search implementation - subclasses can override for specific column searches
      // Note: SQLite doesn't have a generic "search all columns" without FTS,
      // so this provides a basic signature that we can override per repository
      const searchPattern = `%${queryStr}%`;
      if (profileId) {
        return await this.db.getAllAsync(
          `SELECT * FROM ${this.tableName} WHERE profileId = ? AND deletedAt IS NULL LIMIT 20`,
          [profileId]
        );
      }
      return await this.db.getAllAsync(
        `SELECT * FROM ${this.tableName} WHERE deletedAt IS NULL LIMIT 20`
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }
}

export default BaseRepository;
