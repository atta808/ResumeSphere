import BaseRepository from './BaseRepository';
import ErrorHandler from '../services/ErrorHandler';
import { ERROR_CODES } from '../constants/appConstants';

class TemplateSettingsRepository extends BaseRepository {
  constructor() {
    super('resume_template_settings');
  }

  async findByResumeId(resumeId) {
    try {
      return await this.db.getFirstAsync(
        `SELECT * FROM ${this.tableName} WHERE resumeId = ?`,
        [resumeId]
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async upsert(resumeId, settingsData) {
    try {
      const existing = await this.findByResumeId(resumeId);
      const now = new Date().toISOString();

      if (existing) {
        return await this.update(existing.id, {
          ...settingsData,
          updatedAt: now
        });
      } else {
        const id = require('../utils/helpers').generateUUID();
        return await this.create({
          id,
          resumeId,
          ...settingsData,
          createdAt: now,
          updatedAt: now
        });
      }
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }
}

export default new TemplateSettingsRepository();
