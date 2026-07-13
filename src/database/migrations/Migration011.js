export const MIGRATION_011 = `
  CREATE TABLE IF NOT EXISTS portfolios (
    id TEXT PRIMARY KEY,
    profileId TEXT NOT NULL,
    resumeId TEXT,
    templateId TEXT NOT NULL,
    name TEXT NOT NULL,
    portfolioId TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'draft',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    deletedAt TEXT,
    FOREIGN KEY (profileId) REFERENCES profiles (id) ON DELETE CASCADE,
    FOREIGN KEY (resumeId) REFERENCES resumes (id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS portfolio_settings (
    id TEXT PRIMARY KEY,
    portfolioId TEXT NOT NULL,
    theme TEXT DEFAULT 'light',
    primaryColor TEXT,
    accentColor TEXT,
    typography TEXT,
    sectionOrder TEXT,
    hiddenSections TEXT,
    socialLinks TEXT,
    language TEXT DEFAULT 'en',
    visibility TEXT DEFAULT 'private',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (portfolioId) REFERENCES portfolios (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS portfolio_history (
    id TEXT PRIMARY KEY,
    portfolioId TEXT NOT NULL,
    version INTEGER NOT NULL,
    snapshot TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (portfolioId) REFERENCES portfolios (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS qr_codes (
    id TEXT PRIMARY KEY,
    targetUrl TEXT NOT NULL,
    targetType TEXT NOT NULL,
    portfolioId TEXT,
    styleConfig TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    deletedAt TEXT,
    FOREIGN KEY (portfolioId) REFERENCES portfolios (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS portfolio_analytics (
    id TEXT PRIMARY KEY,
    portfolioId TEXT,
    eventType TEXT NOT NULL,
    eventData TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (portfolioId) REFERENCES portfolios (id) ON DELETE CASCADE
  );
`;
