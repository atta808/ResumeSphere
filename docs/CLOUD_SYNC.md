# Cloud Sync

- Managed by `SyncScheduler` running periodically.
- Intercepts SQLite operations, queues them in `sync_queue`.
- Pushes to configured cloud backend (e.g. Firebase) securely when online.
