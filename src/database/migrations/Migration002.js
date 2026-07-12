export const MIGRATION_002 = `
  CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    profileId TEXT,
    resumeName TEXT,
    templateId TEXT,
    isArchived INTEGER DEFAULT 0,
    targetJobTitle TEXT,
    companyName TEXT,
    resumeVersion INTEGER DEFAULT 1,
    atsScore INTEGER DEFAULT 0,
    language TEXT DEFAULT 'en',
    lastExportedAt TEXT,
    createdAt TEXT,
    updatedAt TEXT,
    deletedAt TEXT,
    FOREIGN KEY(profileId) REFERENCES profiles(id)
  );
`;
