import cloudRepository from '../../repositories/cloud/CloudRepository';
import CloudProviderRegistry from './ProviderRegistry';
import * as Crypto from 'expo-crypto';
import ErrorHandler from '../ErrorHandler';

class CloudBackupService {
  constructor() {
    this.provider = CloudProviderRegistry.getProvider();
  }

  async createBackup() {
    try {
      const allData = await cloudRepository.exportFullDatabase();

      const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: allData
      };

      const backupId = Crypto.randomUUID();
      const path = `backups/${backupId}.json`;
      const payloadString = JSON.stringify(backupData);

      await this.provider.uploadData(path, payloadString);

      // Record backup locally
      const sizeBytes = new Blob([payloadString]).size;
      await cloudRepository.recordBackup(backupId, 'FULL', sizeBytes);

      return { success: true, backupId };

    } catch (error) {
      ErrorHandler.logError(error, { context: 'CloudBackupService.createBackup' });
      throw error;
    }
  }
}

export default new CloudBackupService();
