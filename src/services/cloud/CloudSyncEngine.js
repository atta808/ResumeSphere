import OfflineQueueService from './OfflineQueueService';
import ConnectivityMonitor from './ConnectivityMonitor';
import CloudProviderRegistry from './ProviderRegistry';
import SyncStatusService from './SyncStatusService';
import CloudConflictResolver from './CloudConflictResolver';
import cloudRepository from '../../repositories/cloud/CloudRepository';
import ErrorHandler from '../ErrorHandler';

class CloudSyncEngine {
  constructor() {
    this.provider = CloudProviderRegistry.getProvider();
    this.isSyncing = false;
  }

  async processQueue() {
    if (this.isSyncing) return;

    const isConnected = await ConnectivityMonitor.isConnected();
    if (!isConnected) {
      SyncStatusService.setStatus('OFFLINE');
      return;
    }

    this.isSyncing = true;
    SyncStatusService.setStatus('SYNCING');

    try {
      // 1. Pull Changes (Multi-device Support)
      // Only pulling profiles as an example for the architecture
      const lastSyncTime = await cloudRepository.getLastSyncTime();
      try {
        const cloudProfiles = await this.provider.pullChanges('profiles', lastSyncTime);
        for (const cloudProfile of cloudProfiles) {
           // Basic Conflict Resolution: Cloud wins for now if it's newer,
           // but real app would merge or show conflict center.
           // In this architecture, we pass it to the resolver.
           CloudConflictResolver.resolveConflict({}, cloudProfile, 'CLOUD_WINS');
           // (A real implementation would then save the resolved data locally)
        }
      } catch (err) {
        ErrorHandler.logError(err, { context: 'CloudSyncEngine.pullChanges' });
      }

      // 2. Push Changes (Process Local Queue)
      const pendingChanges = await OfflineQueueService.getPendingChanges();

      for (const change of pendingChanges) {
        try {
          // Attempt to sync
          const result = await this.provider.syncEntity(
            change.entityType,
            change.entityId,
            JSON.parse(change.payload),
            change.operation
          );

          // Mark successful and update metadata
          await OfflineQueueService.markAsSynced(change.id, change.entityType, change.entityId, result.cloudId);
        } catch (error) {
          // Mark failed and keep in queue
          await OfflineQueueService.markAsFailed(change.id, error.message);
        }
      }
    } catch (error) {
      ErrorHandler.logError(error, { context: 'CloudSyncEngine.processQueue' });
    } finally {
      this.isSyncing = false;
      SyncStatusService.setStatus('IDLE');
    }
  }
}

export default new CloudSyncEngine();
