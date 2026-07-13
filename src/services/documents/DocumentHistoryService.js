import DocumentHistoryRepository from '../../repositories/DocumentHistoryRepository';
import { DOCUMENT_HISTORY_ACTIONS } from '../../config/documents';

class DocumentHistoryService {
  async addHistory(documentId, action, content, provider = null, model = null) {
    if (!documentId) throw new Error('Document ID is required');

    const currentVersion = await DocumentHistoryRepository.getLatestVersion(documentId);

    return await DocumentHistoryRepository.create({
      documentId,
      version: currentVersion + 1,
      action,
      content,
      provider,
      model
    });
  }

  async getHistory(documentId) {
    return await DocumentHistoryRepository.getHistoryByDocumentId(documentId);
  }
}

export default new DocumentHistoryService();
