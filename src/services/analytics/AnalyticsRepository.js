export class AnalyticsRepository {
  constructor(db) {
    this.db = db;
  }

  async getEventCounts() {
    const rows = await this.db.getAllAsync(
      `SELECT eventType, COUNT(*) as count FROM portfolio_analytics GROUP BY eventType ORDER BY count DESC`
    );
    return rows;
  }
}
