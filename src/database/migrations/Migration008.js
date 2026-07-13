export const MIGRATION_008 = `
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  resumeId TEXT,
  profileId TEXT NOT NULL,
  jobDescriptionId TEXT,
  documentType TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  templateId TEXT,
  provider TEXT,
  model TEXT,
  status TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS document_history (
  id TEXT PRIMARY KEY,
  documentId TEXT NOT NULL,
  version INTEGER NOT NULL,
  action TEXT NOT NULL,
  content TEXT,
  provider TEXT,
  model TEXT,
  createdAt TEXT NOT NULL,
  FOREIGN KEY(documentId) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_documents_profileId ON documents(profileId);
CREATE INDEX IF NOT EXISTS idx_documents_resumeId ON documents(resumeId);
CREATE INDEX IF NOT EXISTS idx_document_history_documentId ON document_history(documentId);
`;
