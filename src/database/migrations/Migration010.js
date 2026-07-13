export const MIGRATION_010 = `
  CREATE TABLE IF NOT EXISTS career_goals (
    id TEXT PRIMARY KEY,
    profileId TEXT NOT NULL,
    title TEXT NOT NULL,
    goalType TEXT NOT NULL,
    targetRole TEXT,
    targetIndustry TEXT,
    targetCompany TEXT,
    priority TEXT,
    status TEXT DEFAULT 'ACTIVE',
    targetDate TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS career_history (
    id TEXT PRIMARY KEY,
    goalId TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT,
    provider TEXT,
    model TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(goalId) REFERENCES career_goals(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS career_recommendations (
    id TEXT PRIMARY KEY,
    goalId TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT,
    estimatedImpact TEXT,
    status TEXT DEFAULT 'PENDING',
    provider TEXT,
    model TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY(goalId) REFERENCES career_goals(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS learning_progress (
    id TEXT PRIMARY KEY,
    goalId TEXT NOT NULL,
    skillName TEXT NOT NULL,
    resourceName TEXT,
    resourceType TEXT,
    estimatedHours REAL,
    completedHours REAL DEFAULT 0,
    completionPercentage REAL DEFAULT 0,
    status TEXT DEFAULT 'NOT_STARTED',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY(goalId) REFERENCES career_goals(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_career_goals_profile ON career_goals(profileId);
  CREATE INDEX IF NOT EXISTS idx_career_history_goal ON career_history(goalId);
  CREATE INDEX IF NOT EXISTS idx_career_recommendations_goal ON career_recommendations(goalId);
  CREATE INDEX IF NOT EXISTS idx_learning_progress_goal ON learning_progress(goalId);
`;
