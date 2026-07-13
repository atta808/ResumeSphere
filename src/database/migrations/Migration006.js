export const MIGRATION_006 = `
CREATE TABLE IF NOT EXISTS resume_template_settings (
  id TEXT PRIMARY KEY,
  resumeId TEXT NOT NULL,
  templateId TEXT DEFAULT 'classic-ats',
  primaryColor TEXT,
  accentColor TEXT,
  fontFamily TEXT,
  fontSize INTEGER,
  spacing TEXT,
  margin TEXT,
  showPhoto INTEGER DEFAULT 1,
  showQR INTEGER DEFAULT 0,
  sectionOrder TEXT,
  hiddenSections TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_template_settings_resumeId ON resume_template_settings(resumeId);
`;
