import * as Crypto from 'expo-crypto';

export const createDocumentHistory = (data) => {
  return {
    id: data.id || Crypto.randomUUID(),
    documentId: data.documentId,
    version: data.version || 1,
    action: data.action,
    content: data.content || '',
    provider: data.provider || null,
    model: data.model || null,
    createdAt: data.createdAt || new Date().toISOString(),
  };
};
