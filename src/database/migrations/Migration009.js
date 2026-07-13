export const MIGRATION_009 = `
  CREATE TABLE IF NOT EXISTS interview_sessions (
    id TEXT PRIMARY KEY,
    resumeId TEXT,
    profileId TEXT,
    jobDescriptionId TEXT,
    interviewType TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    companyName TEXT,
    position TEXT,
    status TEXT DEFAULT 'in_progress',
    startedAt TEXT,
    completedAt TEXT,
    duration INTEGER DEFAULT 0,
    overallScore INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (resumeId) REFERENCES resumes(id) ON DELETE CASCADE,
    FOREIGN KEY (profileId) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (jobDescriptionId) REFERENCES job_descriptions(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS interview_questions (
    id TEXT PRIMARY KEY,
    sessionId TEXT NOT NULL,
    questionNumber INTEGER NOT NULL,
    question TEXT NOT NULL,
    questionType TEXT DEFAULT 'open_text',
    difficulty TEXT,
    category TEXT,
    expectedSkills TEXT, -- stored as JSON string
    createdAt TEXT NOT NULL,
    FOREIGN KEY (sessionId) REFERENCES interview_sessions(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS interview_answers (
    id TEXT PRIMARY KEY,
    questionId TEXT NOT NULL,
    sessionId TEXT NOT NULL,
    answer TEXT NOT NULL,
    feedback TEXT, -- stored as JSON string
    score INTEGER DEFAULT 0,
    strengths TEXT, -- stored as JSON string
    weaknesses TEXT, -- stored as JSON string
    recommendations TEXT, -- stored as JSON string
    estimatedImprovement INTEGER DEFAULT 0,
    timeSpent INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (questionId) REFERENCES interview_questions(id) ON DELETE CASCADE,
    FOREIGN KEY (sessionId) REFERENCES interview_sessions(id) ON DELETE CASCADE
  );
`;
