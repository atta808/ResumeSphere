export const MIGRATION_003 = `
  CREATE TABLE IF NOT EXISTS ai_conversation_sessions (
    id TEXT PRIMARY KEY,
    resumeId TEXT,
    profileId TEXT NOT NULL,
    title TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY(profileId) REFERENCES profiles(id),
    FOREIGN KEY(resumeId) REFERENCES resumes(id)
  );

  CREATE TABLE IF NOT EXISTS ai_conversation_messages (
    id TEXT PRIMARY KEY,
    conversationId TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    actionType TEXT,
    provider TEXT,
    model TEXT,
    tokensUsed INTEGER,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(conversationId) REFERENCES ai_conversation_sessions(id) ON DELETE CASCADE
  );
`;
