import { useState, useEffect } from 'react';
import SyncStatusService from '../services/cloud/SyncStatusService';
import CloudService from '../services/cloud/CloudService';
import OfflineQueueService from '../services/cloud/OfflineQueueService';
import ErrorHandler from '../services/ErrorHandler';

export const useCloudSync = () => {
  const [status, setStatus] = useState(SyncStatusService.getStatus());
  const [stats, setStats] = useState({
    pendingCount: 0,
    failedCount: 0,
    lastSyncTime: null,
    lastBackupTime: null
  });

  useEffect(() => {
    const unsubscribe = SyncStatusService.subscribe((newStatus) => {
      setStatus(newStatus);
      if (newStatus === 'IDLE') {
        fetchDashboardStats(); // Refresh stats when sync completes
      }
    });

    fetchDashboardStats();

    return () => unsubscribe();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const dbStats = await OfflineQueueService.getDashboardStats();
      setStats(dbStats);
    } catch (err) {
      ErrorHandler.logError(err, { context: 'useCloudSync.fetchDashboardStats' });
    }
  };

  const syncNow = async () => {
    try {
      await CloudService.syncNow();
      await fetchDashboardStats();
    } catch (err) {
      ErrorHandler.logError(err, { context: 'useCloudSync.syncNow' });
    }
  };

  const createBackup = async () => {
    try {
      const result = await CloudService.createBackup();
      return result;
    } catch (err) {
      ErrorHandler.logError(err, { context: 'useCloudSync.createBackup' });
      throw err;
    }
  };

  const restoreBackup = async (backupId) => {
    try {
      const result = await CloudService.restoreBackup(backupId);
      return result;
    } catch (err) {
      ErrorHandler.logError(err, { context: 'useCloudSync.restoreBackup' });
      throw err;
    }
  };

  return {
    status,
    stats,
    syncNow,
    createBackup,
    restoreBackup,
    fetchDashboardStats
  };
};
