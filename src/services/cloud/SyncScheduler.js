import CloudSyncEngine from './CloudSyncEngine';
import ConnectivityMonitor from './ConnectivityMonitor';
import ErrorHandler from '../ErrorHandler';
import NetInfo from '@react-native-community/netinfo';

class SyncScheduler {
  constructor() {
    this.intervalId = null;
    this.unsubscribeNetInfo = null;
    this.SYNC_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
  }

  start() {
    if (this.intervalId) return;

    // Start interval
    this.intervalId = setInterval(async () => {
      try {
        const isConnected = await ConnectivityMonitor.isConnected();
        if (isConnected) {
          await CloudSyncEngine.processQueue();
        }
      } catch (error) {
        ErrorHandler.logError(error, { context: 'SyncScheduler.interval' });
      }
    }, this.SYNC_INTERVAL_MS);

    // Listen to network changes for immediate reconnect sync
    this.unsubscribeNetInfo = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        this.forceSync().catch(err => {
           ErrorHandler.logError(err, { context: 'SyncScheduler.netinfo' });
        });
      }
    });
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
      this.unsubscribeNetInfo = null;
    }
  }

  async forceSync() {
    await CloudSyncEngine.processQueue();
  }
}

export default new SyncScheduler();
