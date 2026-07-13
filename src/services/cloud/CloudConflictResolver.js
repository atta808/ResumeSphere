class CloudConflictResolver {
  resolveConflict(localData, cloudData, strategy = 'NEWEST_WINS') {
    switch (strategy) {
      case 'LOCAL_WINS':
        return localData;
      case 'CLOUD_WINS':
        return cloudData;
      case 'NEWEST_WINS':
      default:
        const localTime = new Date(localData.updatedAt || 0).getTime();
        const cloudTime = new Date(cloudData.updatedAt || 0).getTime();
        return localTime >= cloudTime ? localData : cloudData;
    }
  }
}

export default new CloudConflictResolver();
