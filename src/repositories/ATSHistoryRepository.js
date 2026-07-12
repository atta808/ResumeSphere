import BaseRepository from './BaseRepository';
import ErrorHandler from '../services/ErrorHandler';
import { ERROR_CODES } from '../constants/appConstants';
import * as Crypto from 'expo-crypto';

class ATSHistoryRepository extends BaseRepository {
  constructor() {
    super('ats_history');
  }

  async createHistory(resumeId, report) {
    try {
      const id = Crypto.randomUUID();
      const now = new Date().toISOString();
      const reportData = JSON.stringify(report);

      await this.db.runAsync(
        `INSERT INTO ats_history (
          id, resumeId, overallScore, summaryScore, experienceScore,
          educationScore, skillsScore, grammarScore, formattingScore,
          readabilityScore, recommendationCount, provider, algorithmVersion,
          configVersion, reportData, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          resumeId,
          report.overallScore || 0,
          report.categoryScores?.summary || 0,
          report.categoryScores?.experience || 0,
          report.categoryScores?.education || 0,
          report.categoryScores?.skills || 0,
          report.categoryScores?.grammar || 0,
          report.categoryScores?.formatting || 0,
          report.categoryScores?.readability || 0,
          report.recommendations?.length || 0,
          report.provider || 'LocalATSProvider',
          report.version || '1.0',
          report.configVersion || '1.0',
          reportData,
          now
        ]
      );
      return await this.findById(id);
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async getLatestForResume(resumeId) {
    try {
      return await this.db.getFirstAsync(
        `SELECT * FROM ats_history WHERE resumeId = ? ORDER BY createdAt DESC LIMIT 1`,
        [resumeId]
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async getHistoryForResume(resumeId, limit = 10) {
      try {
          return await this.db.getAllAsync(
             `SELECT * FROM ats_history WHERE resumeId = ? ORDER BY createdAt DESC LIMIT ?`,
             [resumeId, limit]
          );
      } catch (error) {
          throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
      }
  }
}

export default new ATSHistoryRepository();
