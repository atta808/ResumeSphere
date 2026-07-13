# Database Overview

We use an offline-first architecture via `expo-sqlite`.

- **Primary DB**: `resumesphere.db`
- **Migrations**: Managed in `src/database/migrations/`. Never delete tables; always create a new migration.
- **Soft Deletes**: Managed via `deletedAt` timestamps.
- **Archiving**: Managed via `isArchived` flag.
- **Cloud Intercept**: All CRUD operations in Repositories are intercepted and queued into `sync_queue`.

Tables include (but not limited to): `profiles`, `resumes`, `ats_history`, `ai_conversation_sessions`, `sync_queue`.
