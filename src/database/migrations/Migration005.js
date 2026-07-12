export const MIGRATION_005 = `
CREATE TABLE IF NOT EXISTS ats_history (
  id TEXT PRIMARY KEY,
  resumeId TEXT NOT NULL,
  overallScore INTEGER NOT NULL,
  summaryScore INTEGER DEFAULT 0,
  experienceScore INTEGER DEFAULT 0,
  educationScore INTEGER DEFAULT 0,
  skillsScore INTEGER DEFAULT 0,
  grammarScore INTEGER DEFAULT 0,
  formattingScore INTEGER DEFAULT 0,
  readabilityScore INTEGER DEFAULT 0,
  recommendationCount INTEGER DEFAULT 0,
  provider TEXT,
  algorithmVersion TEXT,
  configVersion TEXT,
  reportData TEXT,
  createdAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ats_history_resumeId ON ats_history(resumeId);
`;
