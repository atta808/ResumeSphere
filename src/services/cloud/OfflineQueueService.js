import cloudRepository from '../../repositories/cloud/CloudRepository';
import * as Crypto from 'expo-crypto';

class OfflineQueueService {
  async enqueueChange(entityType, entityId, operation, payload) {
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();
    await cloudRepository.enqueueChange(id, entityType, entityId, operation, JSON.stringify(payload), now);
  }

  async getPendingChanges() {
    return await cloudRepository.getPendingChanges();
  }

  async getDashboardStats() {
    const pending = await cloudRepository.getPendingChanges();
    const failed = await cloudRepository.getFailedChanges();
    const lastSync = await cloudRepository.getLastSyncTime();
    const lastBackup = await cloudRepository.getLastBackup();

    return {
      pendingCount: pending.length,
      failedCount: failed.length,
      lastSyncTime: lastSync,
      lastBackupTime: lastBackup?.completedAt || null,
    };
  }

  async markAsSynced(id, entityType, entityId, cloudId) {
    const now = new Date().toISOString();
    await cloudRepository.markAsSynced(id, now);
    await cloudRepository.updateSyncMetadata(entityType, entityId, cloudId, now);
  }

  async markAsFailed(id, errorMessage) {
    const now = new Date().toISOString();
    await cloudRepository.markAsFailed(id, errorMessage, now);
  }
}

export default new OfflineQueueService();
