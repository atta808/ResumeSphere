import cloudRepository from '../../repositories/cloud/CloudRepository';
import CloudProviderRegistry from './ProviderRegistry';
import ErrorHandler from '../ErrorHandler';

class CloudRestoreService {
  constructor() {
    this.provider = CloudProviderRegistry.getProvider();
  }

  async restoreBackup(backupId) {
    try {
      const path = `backups/${backupId}.json`;
      const result = await this.provider.downloadData(path);

      if (!result.success || !result.data || !result.data.data) {
        throw new Error('Failed to download or parse backup data');
      }

      await cloudRepository.restoreFullDatabase(result.data.data);

      return { success: true };
    } catch (error) {
      ErrorHandler.logError(error, { context: 'CloudRestoreService.restoreBackup' });
      throw error;
    }
  }
}

export default new CloudRestoreService();
