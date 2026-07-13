import AIHistoryRepository from '../../repositories/AIHistoryRepository';
import * as Crypto from 'expo-crypto';

class AIHistoryService {
  /**
   * Retrieves all sessions for a specific profile (and optionally a specific resume)
   */
  async getSessions(profileId, resumeId = null, includeHidden = false) {
    if (!profileId) throw new Error('Profile ID is required to fetch AI history.');
    return await AIHistoryRepository.getSessions(profileId, resumeId, includeHidden);
  }

  /**
   * Retrieves a specific session and its messages
   */
  async getSessionWithMessages(sessionId) {
    if (!sessionId) throw new Error('Session ID is required.');
    const session = await AIHistoryRepository.getSessionById(sessionId);
    if (!session) return null;

    const messages = await AIHistoryRepository.getMessagesForSession(sessionId);
    return { ...session, messages };
  }

  /**
   * Creates a new conversation session
   */
  async createSession(profileId, resumeId, title = 'New Conversation') {
    if (!profileId) throw new Error('Profile ID is required to create a session.');

    const now = new Date().toISOString();
    const sessionData = {
      id: Crypto.randomUUID(),
      profileId,
      resumeId: resumeId || null,
      title,
      createdAt: now,
      updatedAt: now,
    };

    return await AIHistoryRepository.createSession(sessionData);
  }

  /**
   * Adds a message to an existing session
   */
  async addMessage(conversationId, role, content, meta = {}) {
    if (!conversationId || !role || !content) {
      throw new Error('Conversation ID, role, and content are required to add a message.');
    }

    const now = new Date().toISOString();
    const messageData = {
      id: Crypto.randomUUID(),
      conversationId,
      role, // 'user', 'assistant', 'system'
      content,
      actionType: meta.actionType || null,
      provider: meta.provider || null,
      model: meta.model || null,
      tokensUsed: meta.tokensUsed || null,
      createdAt: now,
    };

    const savedMessage = await AIHistoryRepository.createMessage(messageData);

    // Update the session's updatedAt timestamp
    await AIHistoryRepository.updateSession(conversationId, { updatedAt: now });

    return savedMessage;
  }

  /**
   * Deletes a single conversation session
   */
  async deleteSession(sessionId) {
    if (!sessionId) throw new Error('Session ID is required for deletion.');
    return await AIHistoryRepository.deleteSession(sessionId);
  }

  /**
   * Clears all AI history for a given profile
   */
  async clearAllHistory(profileId) {
    if (!profileId) throw new Error('Profile ID is required to clear history.');
    return await AIHistoryRepository.clearAllHistory(profileId);
  }

  /**
   * Updates a session's title
   */
  async updateSessionTitle(sessionId, newTitle) {
    if (!sessionId || !newTitle) throw new Error('Session ID and title are required.');
    const now = new Date().toISOString();
    return await AIHistoryRepository.updateSession(sessionId, { title: newTitle, updatedAt: now });
  }
}

export default new AIHistoryService();
