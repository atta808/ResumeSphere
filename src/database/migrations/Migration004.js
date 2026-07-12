export const MIGRATION_004 = `
CREATE TABLE IF NOT EXISTS ocr_queue (
  id TEXT PRIMARY KEY,
  filePath TEXT NOT NULL,
  fileType TEXT NOT NULL,
  status TEXT NOT NULL,
  provider TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  retryCount INTEGER DEFAULT 0,
  errorMessage TEXT
);

CREATE TABLE IF NOT EXISTS import_sessions (
  id TEXT PRIMARY KEY,
  fileName TEXT NOT NULL,
  fileType TEXT NOT NULL,
  provider TEXT NOT NULL,
  ocrText TEXT,
  parsedProfile TEXT,
  confidenceScore REAL,
  processingTime INTEGER,
  createdAt INTEGER NOT NULL
);
`;
