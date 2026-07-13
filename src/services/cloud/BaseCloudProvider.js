export class BaseCloudProvider {
  async uploadData(path, data) {
    throw new Error('uploadData not implemented');
  }

  async downloadData(path) {
    throw new Error('downloadData not implemented');
  }

  async syncEntity(entityType, entityId, payload, operation = 'UPDATE') {
    throw new Error('syncEntity not implemented');
  }

  async pullChanges(entityType, lastSyncTime) {
    throw new Error('pullChanges not implemented');
  }

  async publishPortfolio(portfolioId, htmlContent) {
    throw new Error('publishPortfolio not implemented');
  }
}
