import BaseRepository from './BaseRepository';
import ErrorHandler from '../services/ErrorHandler';
import { ERROR_CODES } from '../constants/appConstants';
import { createDocument } from '../models/Document';

class DocumentRepository extends BaseRepository {
  constructor() {
    super('documents');
  }

  async create(data) {
    const document = createDocument(data);
    await super.create(document);
    return document;
  }

  async update(id, data) {
    data.updatedAt = new Date().toISOString();
    await super.update(id, data);
    return await this.findById(id);
  }

  async getByProfileId(profileId) {
    try {
      return await this.db.getAllAsync(
        'SELECT * FROM documents WHERE profileId = ? ORDER BY updatedAt DESC',
        [profileId]
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }

  async getByResumeId(resumeId) {
    try {
      return await this.db.getAllAsync(
        'SELECT * FROM documents WHERE resumeId = ? ORDER BY updatedAt DESC',
        [resumeId]
      );
    } catch (error) {
      throw ErrorHandler.process(error, ERROR_CODES.DATABASE_ERROR);
    }
  }
}

export default new DocumentRepository();
