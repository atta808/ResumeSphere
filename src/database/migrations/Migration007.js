export const MIGRATION_007 = `
CREATE TABLE IF NOT EXISTS job_descriptions (
  id TEXT PRIMARY KEY,
  companyName TEXT,
  jobTitle TEXT,
  location TEXT,
  employmentType TEXT,
  salary TEXT,
  experienceRequired TEXT,
  educationRequired TEXT,
  requiredSkills TEXT,
  preferredSkills TEXT,
  responsibilities TEXT,
  qualifications TEXT,
  certifications TEXT,
  languages TEXT,
  benefits TEXT,
  originalText TEXT,
  parsedVersion TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS job_matches (
  id TEXT PRIMARY KEY,
  resumeId TEXT NOT NULL,
  jobDescriptionId TEXT NOT NULL,
  overallScore INTEGER,
  skillsScore INTEGER,
  experienceScore INTEGER,
  educationScore INTEGER,
  keywordScore INTEGER,
  responsibilityScore INTEGER,
  certificationScore INTEGER,
  languageScore INTEGER,
  matchedItems TEXT,
  missingItems TEXT,
  extraItems TEXT,
  recommendations TEXT,
  processingTime INTEGER,
  provider TEXT,
  algorithmVersion TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_job_matches_resumeId ON job_matches(resumeId);
CREATE INDEX IF NOT EXISTS idx_job_matches_jobDescriptionId ON job_matches(jobDescriptionId);
`;
