import * as Crypto from 'expo-crypto';

export class PortfolioHistoryService {
  constructor(portfolioHistoryRepo) {
    this.historyRepo = portfolioHistoryRepo;
  }

  async saveSnapshot(portfolioId, portfolioData, settingsData) {
    const latestVersion = await this.historyRepo.getLatestVersion(portfolioId);

    const snapshot = {
      portfolio: portfolioData,
      settings: settingsData
    };

    const historyModel = {
      id: Crypto.randomUUID(),
      portfolioId,
      version: latestVersion + 1,
      snapshot: JSON.stringify(snapshot),
      createdAt: new Date().toISOString()
    };

    return await this.historyRepo.createSnapshot(historyModel);
  }

  async getHistory(portfolioId) {
    return await this.historyRepo.getHistoryForPortfolio(portfolioId);
  }
}
