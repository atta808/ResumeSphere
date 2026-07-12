export const MIGRATION_001 = `
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    fullName TEXT,
    professionalTitle TEXT,
    email TEXT,
    phone TEXT,
    country TEXT,
    city TEXT,
    address TEXT,
    website TEXT,
    linkedIn TEXT,
    gitHub TEXT,
    portfolio TEXT,
    dateOfBirth TEXT,
    nationality TEXT,
    profilePhoto TEXT,
    summary TEXT,
    createdAt TEXT,
    updatedAt TEXT,
    deletedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS education (
    id TEXT PRIMARY KEY,
    profileId TEXT,
    institution TEXT,
    degree TEXT,
    fieldOfStudy TEXT,
    startDate TEXT,
    endDate TEXT,
    isCurrent INTEGER,
    score TEXT,
    description TEXT,
    "order" INTEGER,
    isVisible INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    deletedAt TEXT,
    FOREIGN KEY(profileId) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS experience (
    id TEXT PRIMARY KEY,
    profileId TEXT,
    company TEXT,
    position TEXT,
    location TEXT,
    employmentType TEXT,
    startDate TEXT,
    endDate TEXT,
    isCurrent INTEGER,
    description TEXT,
    "order" INTEGER,
    isVisible INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    deletedAt TEXT,
    FOREIGN KEY(profileId) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    profileId TEXT,
    name TEXT,
    role TEXT,
    url TEXT,
    startDate TEXT,
    endDate TEXT,
    isCurrent INTEGER,
    description TEXT,
    technologies TEXT, -- Store as JSON array string
    "order" INTEGER,
    isVisible INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    deletedAt TEXT,
    FOREIGN KEY(profileId) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    profileId TEXT,
    name TEXT,
    category TEXT,
    level TEXT,
    "order" INTEGER,
    isVisible INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    deletedAt TEXT,
    FOREIGN KEY(profileId) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS languages (
    id TEXT PRIMARY KEY,
    profileId TEXT,
    name TEXT,
    proficiency TEXT,
    "order" INTEGER,
    isVisible INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    deletedAt TEXT,
    FOREIGN KEY(profileId) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    profileId TEXT,
    name TEXT,
    issuer TEXT,
    issueDate TEXT,
    expirationDate TEXT,
    credentialId TEXT,
    credentialUrl TEXT,
    "order" INTEGER,
    isVisible INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    deletedAt TEXT,
    FOREIGN KEY(profileId) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS awards (
    id TEXT PRIMARY KEY,
    profileId TEXT,
    title TEXT,
    issuer TEXT,
    date TEXT,
    description TEXT,
    "order" INTEGER,
    isVisible INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    deletedAt TEXT,
    FOREIGN KEY(profileId) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS references_table (
    id TEXT PRIMARY KEY,
    profileId TEXT,
    name TEXT,
    company TEXT,
    position TEXT,
    email TEXT,
    phone TEXT,
    description TEXT,
    "order" INTEGER,
    isVisible INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    deletedAt TEXT,
    FOREIGN KEY(profileId) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS custom_sections (
    id TEXT PRIMARY KEY,
    profileId TEXT,
    title TEXT,
    content TEXT,
    "order" INTEGER,
    isVisible INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    deletedAt TEXT,
    FOREIGN KEY(profileId) REFERENCES profiles(id)
  );
`;
