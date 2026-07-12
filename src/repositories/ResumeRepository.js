import BaseRepository from './BaseRepository';
import ErrorHandler from '../services/ErrorHandler';
import { ERROR_CODES } from '../constants/appConstants';

class ResumeRepository extends BaseRepository {
  constructor() {
    super('resumes');
  }

  async findAllActive() {
    try {
      return await this.db.getAllAsync(
        `SELECT * FROM ${this.tableName} WHERE deletedAt IS NULL AND isArchived = 0 ORDER BY updatedAt DESC`
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async findAllArchived() {
    try {
      return await this.db.getAllAsync(
        `SELECT * FROM ${this.tableName} WHERE deletedAt IS NULL AND isArchived = 1 ORDER BY updatedAt DESC`
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async search(queryStr, profileId = null) {
    try {
      const searchPattern = `%${queryStr}%`;
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE deletedAt IS NULL
        AND isArchived = 0
        AND resumeName LIKE ?
        ${profileId ? 'AND profileId = ?' : ''}
        ORDER BY updatedAt DESC
      `;
      const params = profileId ? [searchPattern, profileId] : [searchPattern];
      return await this.db.getAllAsync(query, params);
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async toggleArchive(id, isArchived) {
    try {
      const now = new Date().toISOString();
      await this.db.runAsync(
        `UPDATE ${this.tableName} SET isArchived = ?, updatedAt = ? WHERE id = ?`,
        [isArchived ? 1 : 0, now, id]
      );
      return await this.findById(id);
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }
}

export default new ResumeRepository();
