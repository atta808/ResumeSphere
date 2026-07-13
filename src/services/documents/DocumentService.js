import DocumentRepository from '../../repositories/DocumentRepository';
import DocumentHistoryService from './DocumentHistoryService';
import { DOCUMENT_STATUS, DOCUMENT_HISTORY_ACTIONS } from '../../config/documents';

class DocumentService {
  async getDocumentsByProfile(profileId) {
    return await DocumentRepository.getByProfileId(profileId);
  }

  async getDocumentById(id) {
    return await DocumentRepository.findById(id);
  }

  async saveDocument(data) {
    if (data.id) {
      const updated = await DocumentRepository.update(data.id, {
        ...data,
        status: DOCUMENT_STATUS.EDITED
      });
      await DocumentHistoryService.addHistory(
        updated.id,
        DOCUMENT_HISTORY_ACTIONS.EDITED,
        updated.content
      );
      return updated;
    } else {
      const created = await DocumentRepository.create(data);
      await DocumentHistoryService.addHistory(
        created.id,
        DOCUMENT_HISTORY_ACTIONS.GENERATED,
        created.content,
        created.provider,
        created.model
      );
      return created;
    }
  }

  async deleteDocument(id) {
    await DocumentHistoryService.addHistory(id, DOCUMENT_HISTORY_ACTIONS.DELETED, null);
    return await DocumentRepository.delete(id);
  }
}

export default new DocumentService();
