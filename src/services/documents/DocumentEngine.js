import AIService from '../ai/AIService';
import AIHistoryService from '../ai/AIHistoryService';
import DocumentService from './DocumentService';
import ProviderRegistry from './ProviderRegistry';
import { DOCUMENT_STATUS } from '../../config/documents';

class DocumentEngine {
  /**
   * Generates a new document using AI and saves it to the database
   */
  async generateDocument({
    profileId,
    resumeId,
    jobDescriptionId,
    jobDescriptionContext, // Actual content for PromptBuilder
    documentType,
    title,
    userInstructions,
    abortSignal
  }) {
    // 1. Get or create a hidden system session for document generation
    const sessions = await AIHistoryService.getSessions(profileId, resumeId, true);
    let session = sessions.find(s => s.title === 'DOCUMENT_SESSION');

    if (!session) {
      session = await AIHistoryService.createSession(profileId, resumeId, 'DOCUMENT_SESSION');
    }

    const actionType = ProviderRegistry.getActionTypeForDocument(documentType);

    // 2. Call AIService
    const result = await AIService.processRequest({
      actionType,
      profileId,
      resumeId,
      sessionId: session.id,
      userMessage: userInstructions,
      abortSignal,
      jobDescriptionContext
    });

    // 3. Save as Document
    const documentData = {
      profileId,
      resumeId,
      jobDescriptionId,
      documentType,
      title,
      content: result.text,
      provider: result.provider,
      model: result.model,
      status: DOCUMENT_STATUS.GENERATED
    };

    return await DocumentService.saveDocument(documentData);
  }

  /**
   * Regenerates an existing document
   */
  async regenerateDocument(documentId, userInstructions, abortSignal) {
    const doc = await DocumentService.getDocumentById(documentId);
    if (!doc) throw new Error('Document not found');

    const sessions = await AIHistoryService.getSessions(doc.profileId, doc.resumeId, true);
    let session = sessions.find(s => s.title === 'DOCUMENT_SESSION');
    if (!session) {
      session = await AIHistoryService.createSession(doc.profileId, doc.resumeId, 'DOCUMENT_SESSION');
    }

    const actionType = ProviderRegistry.getActionTypeForDocument(doc.documentType);

    const result = await AIService.processRequest({
      actionType,
      profileId: doc.profileId,
      resumeId: doc.resumeId,
      sessionId: session.id,
      userMessage: userInstructions,
      abortSignal,
      // For a real app we might need to fetch the job description context here if needed
    });

    doc.content = result.text;
    doc.status = DOCUMENT_STATUS.GENERATED;

    // Save to db, which adds history
    return await DocumentService.saveDocument(doc);
  }
}

export default new DocumentEngine();
