import BaseRepository from './BaseRepository';
import ErrorHandler from '../services/ErrorHandler';
import { ERROR_CODES } from '../constants/appConstants';
import { createDocumentHistory } from '../models/DocumentHistory';

class DocumentHistoryRepository extends BaseRepository {
  constructor() {
    super('document_history');
  }

  async create(data) {
    const history = createDocumentHistory(data);
    await super.create(history);
    return history;
  }

  async getHistoryByDocumentId(documentId) {
    try {
      return await this.db.getAllAsync(
        'SELECT * FROM document_history WHERE documentId = ? ORDER BY createdAt DESC',
        [documentId]
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async getLatestVersion(documentId) {
    try {
      const result = await this.db.getFirstAsync(
        'SELECT MAX(version) as maxVersion FROM document_history WHERE documentId = ?',
        [documentId]
      );
      return result?.maxVersion || 0;
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }
}

export default new DocumentHistoryRepository();
