import * as Crypto from 'expo-crypto';
import { DOCUMENT_STATUS } from '../config/documents';

export const createDocument = (data) => {
  const now = new Date().toISOString();

  return {
    id: data.id || Crypto.randomUUID(),
    resumeId: data.resumeId || null,
    profileId: data.profileId || null,
    jobDescriptionId: data.jobDescriptionId || null,
    documentType: data.documentType,
    title: data.title || 'Untitled Document',
    content: data.content || '',
    templateId: data.templateId || 'ClassicATS',
    provider: data.provider || null,
    model: data.model || null,
    status: data.status || DOCUMENT_STATUS.GENERATED,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };
};
