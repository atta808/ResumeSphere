export class PortfolioHistoryRepository {
  constructor(db) {
    this.db = db;
  }

  async createSnapshot(historyModel) {
    await this.db.runAsync(
      `INSERT INTO portfolio_history (id, portfolioId, version, snapshot, createdAt)
       VALUES (?, ?, ?, ?, ?)`,
      [
        historyModel.id,
        historyModel.portfolioId,
        historyModel.version,
        historyModel.snapshot, // Store JSON serialized snapshot
        historyModel.createdAt
      ]
    );
    return historyModel;
  }

  async getLatestVersion(portfolioId) {
    const row = await this.db.getFirstAsync(
      `SELECT MAX(version) as maxVersion FROM portfolio_history WHERE portfolioId = ?`,
      [portfolioId]
    );
    return row?.maxVersion || 0;
  }

  async getHistoryForPortfolio(portfolioId) {
    const rows = await this.db.getAllAsync(
      `SELECT * FROM portfolio_history WHERE portfolioId = ? ORDER BY version DESC`,
      [portfolioId]
    );
    return rows.map(r => ({
      ...r,
      snapshot: JSON.parse(r.snapshot)
    }));
  }
}
