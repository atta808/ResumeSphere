import CloudSyncEngine from './CloudSyncEngine';
import CloudBackupService from './CloudBackupService';
import CloudRestoreService from './CloudRestoreService';
import CloudProviderRegistry from './ProviderRegistry';
import ErrorHandler from '../ErrorHandler';

class CloudService {
  constructor() {
    this.provider = CloudProviderRegistry.getProvider();
  }

  // --- Sync Methods ---
  async syncNow() {
    return await CloudSyncEngine.processQueue();
  }

  // --- Backup & Restore Methods ---
  async createBackup() {
    return await CloudBackupService.createBackup();
  }

  async restoreBackup(backupId) {
    return await CloudRestoreService.restoreBackup(backupId);
  }

  // --- Publishing Methods ---
  async publishPortfolio(portfolioId, htmlContent) {
    try {
      return await this.provider.publishPortfolio(portfolioId, htmlContent);
    } catch (error) {
      ErrorHandler.logError(error, { context: 'CloudService.publishPortfolio' });
      throw error;
    }
  }
}

export default new CloudService();
