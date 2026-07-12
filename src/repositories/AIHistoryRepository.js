import BaseRepository from './BaseRepository';
import ErrorHandler from '../services/ErrorHandler';
import { ERROR_CODES } from '../constants/appConstants';

class AIHistoryRepository {
  constructor() {
    this.sessionRepo = new BaseRepository('ai_conversation_sessions');
    this.messageRepo = new BaseRepository('ai_conversation_messages');
  }

  get db() {
    return this.sessionRepo.db;
  }

  // --- Sessions ---

  async createSession(sessionData) {
    return await this.sessionRepo.create(sessionData);
  }

  async getSessions(profileId, resumeId = null) {
    try {
      let query = 'SELECT * FROM ai_conversation_sessions WHERE profileId = ?';
      const params = [profileId];

      if (resumeId) {
        query += ' AND resumeId = ?';
        params.push(resumeId);
      }

      query += ' ORDER BY updatedAt DESC';

      return await this.db.getAllAsync(query, params);
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async getSessionById(sessionId) {
    try {
      return await this.db.getFirstAsync(
        'SELECT * FROM ai_conversation_sessions WHERE id = ?',
        [sessionId]
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async updateSession(sessionId, data) {
    return await this.sessionRepo.update(sessionId, data);
  }

  async deleteSession(sessionId) {
    try {
      // Because we used ON DELETE CASCADE in the migration,
      // deleting the session should delete the messages.
      // However, since we are managing SQLite directly, we'll explicitly delete messages to be safe.
      await this.db.runAsync(
        'DELETE FROM ai_conversation_messages WHERE conversationId = ?',
        [sessionId]
      );

      await this.db.runAsync(
        'DELETE FROM ai_conversation_sessions WHERE id = ?',
        [sessionId]
      );
      return true;
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  // --- Messages ---

  async createMessage(messageData) {
    return await this.messageRepo.create(messageData);
  }

  async getMessagesForSession(sessionId) {
    try {
      return await this.db.getAllAsync(
        'SELECT * FROM ai_conversation_messages WHERE conversationId = ? ORDER BY createdAt ASC',
        [sessionId]
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async deleteMessage(messageId) {
    try {
      await this.db.runAsync(
        'DELETE FROM ai_conversation_messages WHERE id = ?',
        [messageId]
      );
      return true;
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async clearAllHistory(profileId) {
    try {
      // Find all sessions for profile
      const sessions = await this.getSessions(profileId);
      const sessionIds = sessions.map(s => s.id);

      if (sessionIds.length > 0) {
        const placeholders = sessionIds.map(() => '?').join(',');

        await this.db.runAsync(
          `DELETE FROM ai_conversation_messages WHERE conversationId IN (${placeholders})`,
          sessionIds
        );

        await this.db.runAsync(
          `DELETE FROM ai_conversation_sessions WHERE id IN (${placeholders})`,
          sessionIds
        );
      }
      return true;
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }
}

export default new AIHistoryRepository();
