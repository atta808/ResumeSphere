import BaseRepository from './BaseRepository';
import ErrorHandler from '../services/ErrorHandler';
import { ERROR_CODES } from '../constants/appConstants';

class ProfileRepository extends BaseRepository {
  constructor() {
    super('profiles');
  }

  // Override findAll as profile doesn't have a profileId column
  async findAll() {
    try {
      return await this.db.getAllAsync(
        `SELECT * FROM ${this.tableName} WHERE deletedAt IS NULL`
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  // Override count
  async count() {
    try {
      const result = await this.db.getFirstAsync(
        `SELECT COUNT(*) as count FROM ${this.tableName} WHERE deletedAt IS NULL`
      );
      return result?.count || 0;
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }
}

export default new ProfileRepository();
