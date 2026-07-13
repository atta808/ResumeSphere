export const MIGRATION_012 = \`
  CREATE TABLE IF NOT EXISTS sync_metadata (
    id TEXT PRIMARY KEY,
    entityType TEXT NOT NULL,
    entityId TEXT NOT NULL,
    cloudId TEXT,
    syncStatus TEXT DEFAULT 'PENDING',
    lastSyncedAt TEXT,
    version INTEGER DEFAULT 1,
    checksum TEXT,
    updatedAt TEXT NOT NULL,
    UNIQUE(entityType, entityId)
  );

  CREATE TABLE IF NOT EXISTS sync_queue (
    id TEXT PRIMARY KEY,
    entityType TEXT NOT NULL,
    entityId TEXT NOT NULL,
    operation TEXT NOT NULL,
    payload TEXT,
    retryCount INTEGER DEFAULT 0,
    status TEXT DEFAULT 'PENDING',
    errorMessage TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS device_registry (
    id TEXT PRIMARY KEY,
    deviceId TEXT NOT NULL,
    deviceName TEXT,
    deviceType TEXT,
    lastSeenAt TEXT NOT NULL,
    isTrusted INTEGER DEFAULT 0,
    pushToken TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cloud_backups (
    id TEXT PRIMARY KEY,
    backupId TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    size INTEGER DEFAULT 0,
    metadata TEXT,
    createdAt TEXT NOT NULL,
    completedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS sync_conflicts (
    id TEXT PRIMARY KEY,
    entityType TEXT NOT NULL,
    entityId TEXT NOT NULL,
    localData TEXT NOT NULL,
    cloudData TEXT NOT NULL,
    resolutionStrategy TEXT,
    status TEXT DEFAULT 'UNRESOLVED',
    resolvedAt TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sync_logs (
    id TEXT PRIMARY KEY,
    operation TEXT NOT NULL,
    status TEXT NOT NULL,
    details TEXT,
    duration INTEGER,
    createdAt TEXT NOT NULL
  );
\`;
